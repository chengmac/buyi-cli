'use strict';

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");

async function initProject() {
  const answer = await inquirer.default.prompt([
    {
      type: "input",
      message: "Enter project name",
      name: "projectName",
    },
    {
      type: "list",
      message: "Select a template",
      name: "template",
      default: "react-app",
      choices: ["react-app", "react-library"],
    },
  ]);

  const { projectName, template } = answer;

  // projectName 不能为空
  if (!projectName) {
    console.log(chalk.red.bold(`❌ please enter project name`));
    process.exit(1);
  }

  // template 选择 react-library 时暂不支持
  if (template === "react-library") {
    console.log(
      chalk.red.bold(`😂 selected template ${template} is not supported`)
    );
    process.exit(1);
  }

  const isOverwrite = process.argv.includes("--force");

  const projectPath = path.resolve(process.cwd(), projectName);
  const projectExists = fs.existsSync(projectPath);

  // 不强制覆盖创建时检查项目是否存在
  if (!isOverwrite && projectExists) {
    console.log(
      chalk.red.bold(`❌ Project ${answer.projectName} already exists.`)
    );
    process.exit(1);
  }

  const templatePath = path.join(__dirname, "./templates", template);

  // 将模板复制到项目目录下
  await copyDir(templatePath, projectPath);

  // 更新 package.json
  const packagePath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await fs.readFileSync(packagePath, "utf8"));
  packageJson.name = projectName;
  await fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

  console.log(
    chalk.green.bold`✅ Project ${projectName} created successfully.`
  );
}

function copyDir(src, dest) {
  // 确保源目录存在
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory ${src} does not exist`);
  }

  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录中的文件和子目录
  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    // 检查是否是目录
    if (fs.lstatSync(srcPath).isDirectory()) {
      // 递归复制目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

module.exports = initProject;
