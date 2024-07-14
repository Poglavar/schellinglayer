pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract TwitterVerification is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    mapping(address => string) public verifiedHandles;

    constructor() {
        setPublicChainlinkToken();
        oracle = 0xYourOracleAddress;  // Replace with your oracle address
        jobId = "YourJobId";           // Replace with your job ID
        fee = 0.1 * 10 ** 18;          // Fee in LINK
    }

    function requestTwitterVerification(string memory handle, string memory tweetId) public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("handle", handle);
        req.add("tweetId", tweetId);
        sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, bool verified) public recordChainlinkFulfillment(_requestId) {
        if (verified) {
            verifiedHandles[msg.sender] = handle;
        }
    }
}