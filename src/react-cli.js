#!/usr/bin/env node

const { program } = require("commander");
const initProject = require("./init");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const nodeVersion = process.versions.node.split(".")[0];
if (nodeVersion <= "18") {
  console.error(
    chalk.yellow.bold("Nodejs version must be greater than or equal to v18")
  );
  process.exit(1);
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8")
);

program
  .name(packageJson.name)
  .version(packageJson.version)
  .command("init")
  .description("create a new project powered by react")
  .option("-f, --force", "overwrite target directory if it exists")
  .action(() => {
    initProject();
  });

program.parse(process.argv);
