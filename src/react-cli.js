#!/usr/bin/env node

const { program } = require("commander");
const initProject = require("./init");
const fs = require("fs");
const path = require("path");

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
