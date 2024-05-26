const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // Assume `suitableAddress` is an Ethereum address you control or can impersonate, 
    // which satisfies the required condition
    const suitableAddress = '0x00112233445566778899aabbccddeeff00112233'; // Example address
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [suitableAddress],
    });

    const signer = await ethers.getSigner(suitableAddress);
    const defaultSigner = ethers.provider.getSigner(0); // Default signer with plenty of ETH

    // Transfer ETH to the impersonated account
    const tx = await defaultSigner.sendTransaction({
      to: suitableAddress,
      value: ethers.utils.parseEther("1.0") // Send 1 ETH
    });
    await tx.wait();

    // Now attempt to win the game
    await game.connect(signer).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
