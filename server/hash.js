// hash.js
import bcrypt from "bcrypt";

const run = async () => {
  const plain = "Rajsharma";   // put the current password stored in DB
  const hashed = await bcrypt.hash(plain, 10);
  console.log("Hashed password:", hashed);
};

run();
