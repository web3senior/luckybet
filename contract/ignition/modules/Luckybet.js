const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Luckybet", (m) => {

  const owner = m.getParameter("initialOwner", '0xE570375908C46597CF5BBeA3a9E8b694E1E57158');


  const lock = m.contract("Luckybet", [owner]);

  return { lock };
});
