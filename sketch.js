// 宣告目前題目索引
let currentQuestion = 0; // 儲存目前顯示的題目編號

// 宣告答對題數
let score = 0; // 儲存使用者答對的題目數量

// 宣告選取的選項
let selectedOption = -1; // -1 代表尚未選擇任何選項

// 宣告是否已經作答
let hasAnswered = false; // 記錄目前題目是否已經回答

// 宣告測驗是否結束
let isFinished = false; // 記錄測驗是否已經完成

// 宣告目前版面資料
let layout = {}; // 儲存所有響應式版面座標與尺寸

// 宣告正確答案顏色
const CORRECT_COLOR = "#FFE381"; // 設定正確答案背景顏色

// 宣告錯誤答案顏色
const WRONG_COLOR = "#C1121F"; // 設定錯誤答案背景顏色

// 宣告題目方框顏色
const QUESTION_BOX_COLOR = "#BDE0FE"; // 設定題目方框背景顏色

// 宣告畫布背景顏色
const BACKGROUND_COLOR = "#F4F7F9"; // 設定畫布背景顏色

// 宣告主要文字顏色
const TEXT_COLOR = "#263238"; // 設定一般文字顏色

// 建立測驗題目資料
const questions = [
  {
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",
    options: ["draw()", "setup()", "start()", "begin()"],
    answer: 1
  },
  {
    question: "在 p5.js 中，哪一個函式會持續重複執行？",
    options: ["loop()", "repeat()", "draw()", "update()"],
    answer: 2
  },
  {
    question: "下列哪一個指令可以設定畫布大小？",
    options: [
      "canvas(400, 300)",
      "size(400, 300)",
      "createCanvas(400, 300)",
      "setCanvas(400, 300)"
    ],
    answer: 2
  },
  {
    question: "在 p5.js 中，哪一個指令可以繪製圓形？",
    options: ["circle()", "ellipse()", "round()", "oval()"],
    answer: 1
  },
  {
    question: "下列哪一個指令可以設定背景顏色？",
    options: [
      "background()",
      "bgColor()",
      "colorBackground()",
      "setBackground()"
    ],
    answer: 0
  }
];

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中
  textAlign(CENTER, CENTER);

  // 設定矩形以中心點方式繪製
  rectMode(CENTER);

  // 設定文字換行模式
  textWrap(WORD);

  // 計算響應式版面
  layout = getQuizLayout();
}

// p5.js 每一幀執行一次
function draw() {
  // 設定畫布背景
  background(BACKGROUND_COLOR);

  // 重新計算目前版面
  layout = getQuizLayout();

  // 判斷測驗是否完成
  if (isFinished) {
    // 顯示測驗完成畫面
    drawFinishScreen();

    // 結束本次繪圖
    return;
  }

  // 顯示測驗標題
  drawTitle();

  // 顯示題目方框
  drawQuestion();

  // 顯示選項
  drawOptions();

  // 顯示下一題按鈕
  drawNextButton();
}

// 計算響應式版面
function getQuizLayout() {
  // 取得畫布寬度
  const canvasWidth = width;

  // 取得畫布高度
  const canvasHeight = height;

  // 取得畫布最短邊
  const shortestSide = min(canvasWidth, canvasHeight);

  // 判斷是否為窄版手機畫面
  const isNarrow = canvasWidth < 600;

  // 判斷是否為橫向矮畫面
  const isShort = canvasHeight < 560;

  // 設定安全邊界
  const margin = constrain(shortestSide * 0.06, 14, 42);

  // 設定標題字體大小
  const titleSize = constrain(shortestSide * 0.075, 22, 42);

  // 設定進度字體大小
  const progressSize = constrain(shortestSide * 0.037, 14, 22);

  // 設定題目字體大小
  const questionSize = constrain(shortestSide * 0.045, 16, 27);

  // 設定選項字體大小
  const optionSize = constrain(shortestSide * 0.037, 15, 22);

  // 設定按鈕字體大小
  const buttonSize = constrain(shortestSide * 0.04, 16, 23);

  // 設定題目卡片寬度
  const questionWidth = min(canvasWidth - margin * 2, 920);

  // 設定題目卡片內距
  const questionPadding = constrain(shortestSide * 0.05, 16, 38);

  // 設定題目文字最大寬度
  const questionTextWidth = questionWidth - questionPadding * 2;

  // 設定題目文字大小
  textSize(questionSize);

  // 將題目文字自動換行
  const questionLines = wrapTextByWidth(
    questions[currentQuestion].question,
    questionTextWidth
  );

  // 計算題目每一行高度
  const questionLineHeight = questionSize * 1.35;

  // 計算題目文字總高度
  const questionTextHeight = questionLines.length * questionLineHeight;

  // 設定題目卡片高度
  const questionHeight = max(
    questionTextHeight + questionPadding * 2,
    isShort ? 82 : 110
  );

  // 設定標題區域位置
  const titleY = max(28, canvasHeight * 0.075);

  // 設定進度文字位置
  const progressY = titleY + titleSize * 0.75;

  // 設定題目卡片位置
  const questionY = progressY + progressSize + questionHeight * 0.58;

  // 設定內容起始位置
  const contentTop = questionY + questionHeight / 2;

  // 設定選項間距
  const optionGap = constrain(
    isShort ? shortestSide * 0.018 : shortestSide * 0.028,
    8,
    22
  );

  // 設定選項高度
  const optionHeight = constrain(
    isShort ? canvasHeight * 0.08 : canvasHeight * 0.072,
    42,
    64
  );

  // 設定選項寬度
  const optionWidth = min(canvasWidth - margin * 2, 780);

  // 計算四個選項總高度
  const optionsHeight = optionHeight * 4 + optionGap * 3;

  // 設定按鈕高度
  const buttonHeight = constrain(shortestSide * 0.095, 44, 60);

  // 設定按鈕寬度
  const buttonWidth = constrain(shortestSide * 0.32, 150, 230);

  // 設定底部安全距離
  const bottomMargin = constrain(shortestSide * 0.05, 12, 28);

  // 設定下一題按鈕位置
  const buttonY = canvasHeight - bottomMargin - buttonHeight / 2;

  // 設定選項第一個位置
  let optionsStartY = contentTop + optionGap + optionHeight / 2;

  // 計算可用內容底部位置
  const availableBottom = buttonY - buttonHeight / 2 - bottomMargin;

  // 計算選項區域底部位置
  const optionsBottom = optionsStartY + optionsHeight;

  // 判斷選項是否可能超出按鈕區域
  if (optionsBottom > availableBottom) {
    // 計算可上移的距離
    const moveUp = optionsBottom - availableBottom;

    // 將選項整體向上移動
    optionsStartY -= moveUp;
  }

  // 建立選項矩形資料
  const optionRects = [];

  // 逐一建立四個選項的版面資料
  for (let i = 0; i < 4; i++) {
    // 計算選項垂直位置
    const optionY = optionsStartY + i * (optionHeight + optionGap);

    // 建立目前選項矩形資料
    optionRects.push({
      x: canvasWidth / 2,
      y: optionY,
      w: optionWidth,
      h: optionHeight
    });
  }

  // 回傳完整響應式版面資料
  return {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    shortestSide: shortestSide,
    isNarrow: isNarrow,
    isShort: isShort,
    margin: margin,
    titleSize: titleSize,
    progressSize: progressSize,
    questionSize: questionSize,
    optionSize: optionSize,
    buttonSize: buttonSize,
    questionWidth: questionWidth,
    questionHeight: questionHeight,
    questionPadding: questionPadding,
    questionTextWidth: questionTextWidth,
    questionLines: questionLines,
    questionLineHeight: questionLineHeight,
    questionTextHeight: questionTextHeight,
    questionY: questionY,
    optionWidth: optionWidth,
    optionHeight: optionHeight,
    optionGap: optionGap,
    optionRects: optionRects,
    buttonWidth: buttonWidth,
    buttonHeight: buttonHeight,
    buttonY: buttonY
  };
}

// 顯示測驗標題
function drawTitle() {
  // 移除外框
  noStroke();

  // 設定文字顏色
  fill(TEXT_COLOR);

  // 設定標題文字大小
  textSize(layout.titleSize);

  // 顯示標題
  text("p5.js 程式設計簡易測驗", width / 2, layout.titleY);

  // 設定進度文字大小
  textSize(layout.progressSize);

  // 顯示答題進度
  text(
    "第 " + (currentQuestion + 1) + " 題／共 " + questions.length + " 題",
    width / 2,
    layout.progressY
  );
}

// 顯示題目
function drawQuestion() {
  // 設定題目方框背景顏色
  fill(QUESTION_BOX_COLOR);

  // 設定題目方框外框顏色
  stroke("#8DB9DD");

  // 設定外框粗細
  strokeWeight(2);

  // 繪製置中的題目方框
  rect(
    width / 2,
    layout.questionY,
    layout.questionWidth,
    layout.questionHeight,
    18
  );

  // 移除文字外框
  noStroke();

  // 設定題目文字顏色
  fill(TEXT_COLOR);

  // 設定題目文字大小
  textSize(layout.questionSize);

  // 設定文字對齊方式
  textAlign(CENTER, CENTER);

  // 計算題目文字起始位置
  const startY =
    layout.questionY -
    layout.questionTextHeight / 2 +
    layout.questionLineHeight / 2;

  // 逐行顯示題目
  for (let i = 0; i < layout.questionLines.length; i++) {
    // 顯示目前一行題目文字
    text(
      layout.questionLines[i],
      width / 2,
      startY + i * layout.questionLineHeight
    );
  }
}

// 依照文字寬度自動換行
function wrapTextByWidth(content, maxWidth) {
  // 建立文字行陣列
  const lines = [];

  // 建立目前文字行
  let currentLine = "";

  // 將文字拆成單一字元
  const characters = content.split("");

  // 逐一處理文字
  for (let i = 0; i < characters.length; i++) {
    // 取得目前字元
    const character = characters[i];

    // 建立測試文字
    const testLine = currentLine + character;

    // 測量測試文字寬度
    const measuredWidth = textWidth(testLine);

    // 判斷是否超出最大寬度
    if (measuredWidth > maxWidth && currentLine.length > 0) {
      // 將目前文字行加入陣列
      lines.push(currentLine);

      // 將目前字元設定為下一行文字
      currentLine = character;
    } else {
      // 將字元加入目前文字行
      currentLine = testLine;
    }
  }

  // 判斷是否還有最後一行
  if (currentLine.length > 0) {
    // 將最後一行加入陣列
    lines.push(currentLine);
  }

  // 回傳自動換行結果
  return lines;
}

// 顯示選項
function drawOptions() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 設定選項文字大小
  textSize(layout.optionSize);

  // 逐一繪製選項
  for (let i = 0; i < questionData.options.length; i++) {
    // 取得目前選項矩形資料
    const option = layout.optionRects[i];

    // 設定選項水平位置
    let optionX = option.x;

    // 設定選項垂直位置
    let optionY = option.y;

    // 判斷是否已經作答
    if (hasAnswered) {
      // 判斷是否為正確答案
      if (i === questionData.answer) {
        // 讓正確答案上下跳動
        optionY += sin(frameCount * 0.12) * layout.shortestSide * 0.018;
      }

      // 判斷是否為答錯的選項
      if (i === selectedOption && selectedOption !== questionData.answer) {
        // 讓錯誤選項左右移動
        optionX += sin(frameCount * 0.25) * layout.shortestSide * 0.02;
      }
    }

    // 設定選項預設背景
    let optionColor = "#FFFFFF";

    // 判斷是否為正確答案
    if (hasAnswered && i === questionData.answer) {
      // 設定正確答案背景
      optionColor = CORRECT_COLOR;
    }

    // 判斷是否為錯誤答案
    if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== questionData.answer
    ) {
      // 設定錯誤答案背景
      optionColor = WRONG_COLOR;
    }

    // 設定選項背景顏色
    fill(optionColor);

    // 設定選項外框
    stroke("#B8C4CA");

    // 設定外框粗細
    strokeWeight(2);

    // 繪製選項
    rect(optionX, optionY, option.w, option.h, 14);

    // 移除文字外框
    noStroke();

    // 設定文字顏色
    if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== questionData.answer
    ) {
      // 錯誤選項使用白色文字
      fill("#FFFFFF");
    } else {
      // 一般選項使用深色文字
      fill(TEXT_COLOR);
    }

    // 建立選項文字
    const optionText =
      String.fromCharCode(65 + i) + ". " + questionData.options[i];

    // 顯示選項文字
    text(optionText, optionX, optionY);
  }
}

// 顯示下一題按鈕
function drawNextButton() {
  // 尚未作答時不顯示按鈕
  if (!hasAnswered) {
    // 結束函式
    return;
  }

  // 設定按鈕水平位置
  const buttonX = width / 2;

  // 設定按鈕背景顏色
  fill("#1976D2");

  // 設定按鈕外框顏色
  stroke("#125A9C");

  // 設定外框粗細
  strokeWeight(2);

  // 繪製下一題按鈕
  rect(
    buttonX,
    layout.buttonY,
    layout.buttonWidth,
    layout.buttonHeight,
    14
  );

  // 移除外框
  noStroke();

  // 設定按鈕文字顏色
  fill("#FFFFFF");

  // 設定按鈕文字大小
  textSize(layout.buttonSize);

  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 顯示查看結果文字
    text("查看結果", buttonX, layout.buttonY);
  } else {
    // 顯示下一題文字
    text("下一題", buttonX, layout.buttonY);
  }
}

// 顯示測驗完成畫面
function drawFinishScreen() {
  // 取得最短邊
  const shortestSide = min(width, height);

  // 設定結果標題文字大小
  const resultTitleSize = constrain(shortestSide * 0.09, 26, 56);

  // 設定結果分數文字大小
  const resultScoreSize = constrain(shortestSide * 0.07, 22, 46);

  // 設定結果說明文字大小
  const resultTextSize = constrain(shortestSide * 0.04, 16, 28);

  // 設定結果標題文字顏色
  fill(TEXT_COLOR);

  // 移除外框
  noStroke();

  // 設定標題文字大小
  textSize(resultTitleSize);

  // 顯示完成文字
  text("測驗完成！", width / 2, height * 0.25);

  // 設定分數文字大小
  textSize(resultScoreSize);

  // 顯示答對題數
  text(
    "你答對了 " + score + "／" + questions.length + " 題",
    width / 2,
    height * 0.42
  );

  // 設定說明文字大小
  textSize(resultTextSize);

  // 判斷分數
  if (score === questions.length) {
    // 顯示滿分訊息
    text("太厲害了！全部答對！", width / 2, height * 0.53);
  } else if (score >= 3) {
    // 顯示良好訊息
    text("表現很好，繼續加油！", width / 2, height * 0.53);
  } else {
    // 顯示鼓勵訊息
    text("再多練習幾次，你一定會進步！", width / 2, height * 0.53);
  }

  // 設定重新測驗按鈕尺寸
  const buttonWidth = constrain(shortestSide * 0.38, 170, 240);

  // 設定重新測驗按鈕高度
  const buttonHeight = constrain(shortestSide * 0.11, 48, 64);

  // 設定重新測驗按鈕位置
  const buttonY = height * 0.70;

  // 儲存重新測驗按鈕位置
  layout.restartButton = {
    x: width / 2,
    y: buttonY,
    w: buttonWidth,
    h: buttonHeight
  };

  // 設定按鈕背景顏色
  fill("#1976D2");

  // 設定按鈕外框顏色
  stroke("#125A9C");

  // 設定外框粗細
  strokeWeight(2);

  // 繪製重新測驗按鈕
  rect(width / 2, buttonY, buttonWidth, buttonHeight, 14);

  // 移除外框
  noStroke();

  // 設定按鈕文字顏色
  fill("#FFFFFF");

  // 設定按鈕文字大小
  textSize(constrain(shortestSide * 0.045, 18, 25));

  // 顯示重新測驗文字
  text("重新測驗", width / 2, buttonY);
}

// 處理滑鼠按下
function mousePressed() {
  // 處理使用者輸入
  handleInput(mouseX, mouseY);

  // 停止瀏覽器預設行為
  return false;
}

// 處理觸控開始
function touchStarted() {
  // 判斷是否有觸控點
  if (touches.length > 0) {
    // 處理第一個觸控點
    handleInput(touches[0].x, touches[0].y);
  }

  // 停止手機頁面捲動
  return false;
}

// 處理滑鼠與觸控輸入
function handleInput(inputX, inputY) {
  // 判斷測驗是否已經結束
  if (isFinished) {
    // 取得重新測驗按鈕
    const button = layout.restartButton;

    // 判斷是否點擊重新測驗按鈕
    if (
      button &&
      inputX >= button.x - button.w / 2 &&
      inputX <= button.x + button.w / 2 &&
      inputY >= button.y - button.h / 2 &&
      inputY <= button.y + button.h / 2
    ) {
      // 重新開始測驗
      restartQuiz();
    }

    // 結束輸入處理
    return;
  }

  // 判斷是否尚未作答
  if (!hasAnswered) {
    // 逐一檢查所有選項
    for (let i = 0; i < layout.optionRects.length; i++) {
      // 取得目前選項
      const option = layout.optionRects[i];

      // 判斷是否點擊目前選項
      if (
        inputX >= option.x - option.w / 2 &&
        inputX <= option.x + option.w / 2 &&
        inputY >= option.y - option.h / 2 &&
        inputY <= option.y + option.h / 2
      ) {
        // 記錄選取選項
        selectedOption = i;

        // 設定已作答
        hasAnswered = true;

        // 判斷答案是否正確
        if (selectedOption === questions[currentQuestion].answer) {
          // 答對題數加一
          score++;
        }

        // 結束選項檢查
        return;
      }
    }

    // 尚未點擊選項時結束處理
    return;
  }

  // 設定下一題按鈕資料
  const nextButton = {
    x: width / 2,
    y: layout.buttonY,
    w: layout.buttonWidth,
    h: layout.buttonHeight
  };

  // 判斷是否點擊下一題按鈕
  if (
    inputX >= nextButton.x - nextButton.w / 2 &&
    inputX <= nextButton.x + nextButton.w / 2 &&
    inputY >= nextButton.y - nextButton.h / 2 &&
    inputY <= nextButton.y + nextButton.h / 2
  ) {
    // 判斷目前是否為最後一題
    if (currentQuestion === questions.length - 1) {
      // 設定測驗結束
      isFinished = true;
    } else {
      // 前往下一題
      currentQuestion++;

      // 清除選項
      selectedOption = -1;

      // 設定為尚未作答
      hasAnswered = false;
    }
  }
}

// 處理鍵盤按鍵
function keyPressed() {
  // 判斷是否尚未作答
  if (!hasAnswered && !isFinished) {
    // 將數字鍵轉成選項索引
    const keyIndex = int(key) - 1;

    // 判斷是否為有效選項
    if (keyIndex >= 0 && keyIndex < 4) {
      // 記錄選取選項
      selectedOption = keyIndex;

      // 設定已經作答
      hasAnswered = true;

      // 判斷答案是否正確
      if (selectedOption === questions[currentQuestion].answer) {
        // 答對題數加一
        score++;
      }
    }
  } else if (hasAnswered && !isFinished && keyCode === ENTER) {
    // 判斷目前是否為最後一題
    if (currentQuestion === questions.length - 1) {
      // 設定測驗結束
      isFinished = true;
    } else {
      // 前往下一題
      currentQuestion++;

      // 清除選項
      selectedOption = -1;

      // 設定尚未作答
      hasAnswered = false;
    }
  } else if (isFinished && keyCode === ENTER) {
    // 重新開始測驗
    restartQuiz();
  }

  // 停止瀏覽器預設行為
  return false;
}

// 重新開始測驗
function restartQuiz() {
  // 回到第一題
  currentQuestion = 0;

  // 分數歸零
  score = 0;

  // 清除選項
  selectedOption = -1;

  // 設定尚未作答
  hasAnswered = false;

  // 設定測驗尚未完成
  isFinished = false;
}

// 當視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算響應式版面
  layout = getQuizLayout();
}
