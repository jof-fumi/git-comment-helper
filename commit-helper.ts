#!/usr/bin/env ts-node

import fs from "fs-extra";
import inquirer from "inquirer";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(
  process.env.HOME || process.env.USERPROFILE || ".",
  ".commit_helper.json"
);

interface CommitConfig {
  projectName: string;
  ticketNumber: string;
}

const loadLastCommitInfo = (): CommitConfig | null => {
  if (fs.existsSync(configPath)) {
    return fs.readJsonSync(configPath);
  }
  return null;
};

const saveCommitInfo = (config: CommitConfig) => {
  fs.writeJsonSync(configPath, config, { spaces: 2 });
};

const main = async () => {
  const lastCommitInfo = loadLastCommitInfo();

  let projectName = "";
  let ticketNumber = "";

  if (lastCommitInfo) {
    const { useLastInfo } = await inquirer.prompt({
      type: "confirm",
      name: "useLastInfo",
      message: `前回の案件: [${lastCommitInfo.projectName}] ${lastCommitInfo.ticketNumber} ですか？`,
      default: true,
    });

    if (useLastInfo) {
      projectName = lastCommitInfo.projectName;
      ticketNumber = lastCommitInfo.ticketNumber;
    }
  }

  // チケットは発行しない作業もあるので、チケット番号がなくても前回のコミットがあれば利用する
  if (!projectName || (!ticketNumber && !lastCommitInfo)) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "案件名を入力してください:",
      },
      {
        type: "input",
        name: "ticketNumber",
        message: "チケット番号を入力してください:",
      },
    ]);
    projectName = answers.projectName;
    ticketNumber = answers.ticketNumber;
    saveCommitInfo({ projectName, ticketNumber });
  }

  const { commitMessage } = await inquirer.prompt({
    type: "input",
    name: "commitMessage",
    message: "修正内容を入力してください:",
  });

  const fullMessage = `[${projectName}] ${ticketNumber} | ${commitMessage}`;
  console.log(`コミットメッセージ: ${fullMessage}`);

  const { confirmCommit } = await inquirer.prompt({
    type: "confirm",
    name: "confirmCommit",
    message: "このメッセージでコミットしますか？",
    default: true,
  });

  if (confirmCommit) {
    execSync(`git commit -m "${fullMessage}"`, { stdio: "inherit" });
    console.log("✅ コミットしました！");
  } else {
    console.log("❌ キャンセルしました。");
  }
};

main().catch(console.error);
