import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { toUtf8Bytes } from "@ethersproject/strings";
import { ethers } from 'hardhat';
import { arrayify } from 'ethers/lib/utils';
const { utils } = ethers;

describe('GuessTheSecretNumberChallenge', () => {
  let target: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('GuessTheSecretNumberChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {

    const hash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

    let preimage = 0;

    for (let i = 0; i < 256; i++) {
      
      if (utils.keccak256(arrayify(i)) == hash) {

        preimage = i;
      }
    }

    const tx = await target.guess(preimage, {value: ethers.utils.parseEther("1.0")});

    await tx.wait();

    expect(await target.isComplete()).to.equal(true);
  });
});
