let standSpriteSheet;
let walkSpriteSheet;
let runSpriteSheet;
let rollSpriteSheet;
let jumpSpriteSheet;
let attackSpriteSheet;
let standAnimation = [];
let walkAnimation = [];
let runAnimation = [];
let rollAnimation = [];
let jumpAnimation = [];
let attackAnimation = [];
let characterX;
let characterY;
let velocityY = 0;
const gravity = 0.6;
const jumpForce = -15;
let isJumping = false;
let isAttacking = false;
let groundY;

let currentFrameIndex = 0;
let lastAnimationType = null;
let direction = 1; // 1 for right, -1 for left


// 待機動畫的屬性
const standFrameCount = 16;
const standSheetWidth = 699;
const standFrameWidth = standSheetWidth / standFrameCount;

// 走路動畫的屬性
const walkFrameCount = 17;
const walkSheetWidth = 930;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跑步動畫的屬性
const runFrameCount = 16;
const runSheetWidth = 1243;
const runFrameHeight = 70;
const runFrameWidth = runSheetWidth / runFrameCount;

// 翻滾動畫的屬性
const rollFrameCount = 3;
const rollSheetWidth = 184;
const rollFrameHeight = 53;
const rollFrameWidth = rollSheetWidth / rollFrameCount;

// 跳躍動畫的屬性
const jumpFrameCount = 4;
const jumpSheetWidth = 247;
const jumpFrameHeight = 72;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

// 攻擊動畫的屬性
const attackFrameCount = 19;
const attackSheetWidth = 2788;
const attackFrameHeight = 89;
const attackFrameWidth = attackSheetWidth / attackFrameCount;

// 在 setup() 之前預先載入圖片資源
function preload() {
  standSpriteSheet = loadImage('角色一/待機/all.png');
  walkSpriteSheet = loadImage('角色一/走/all.png');
  runSpriteSheet = loadImage('角色一/跑跑/all.png');
  rollSpriteSheet = loadImage('角色一/翻滾/all.png');
  jumpSpriteSheet = loadImage('角色一/跳/all2.png');
  attackSpriteSheet = loadImage('角色一/向前攻擊/all.png');
}

function setup() {
  // 建立一個填滿整個瀏覽器視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫面中央
  characterX = width / 2;
  groundY = height / 2;
  characterY = groundY;

  // 將圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < standFrameCount; i++) {
    let frame = standSpriteSheet.get(i * standFrameWidth, 0, standFrameWidth, 88); // 待機高度為 88
    standAnimation.push(frame);
  }

  // 將走路的圖片精靈切割成 17 個獨立的畫格
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, 88); // 走路高度為 88
    walkAnimation.push(frame);
  }

  // 將跑步的圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < runFrameCount; i++) {
    let frame = runSpriteSheet.get(i * runFrameWidth, 0, runFrameWidth, runFrameHeight);
    runAnimation.push(frame);
  }

  // 將翻滾的圖片精靈切割成 11 個獨立的畫格
  for (let i = 0; i < rollFrameCount; i++) {
    let frame = rollSpriteSheet.get(i * rollFrameWidth, 0, rollFrameWidth, rollFrameHeight);
    rollAnimation.push(frame);
  }

  // 將跳躍的圖片精靈切割成 4 個獨立的畫格
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = jumpSpriteSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }

  // 將攻擊的圖片精靈切割成 19 個獨立的畫格
  for (let i = 0; i < attackFrameCount; i++) {
    let frame = attackSpriteSheet.get(i * attackFrameWidth, 0, attackFrameWidth, attackFrameHeight);
    attackAnimation.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#a8dadc');

  // 設定圖片的繪製模式為中心對齊
  imageMode(CENTER);

  // --- 攻擊動畫邏輯 (最高優先級) ---
  if (isAttacking) {
    // 根據角色方向繪製攻擊動畫
    if (direction === -1) {
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(attackAnimation[currentFrameIndex], 0, 0);
      pop();
    } else {
      image(attackAnimation[currentFrameIndex], characterX, characterY);
    }

    // 每 3 個繪圖幀更新一次攻擊動畫的畫格
    if (frameCount % 3 === 0) {
      currentFrameIndex++;
    }

    // 如果動畫播放完畢，結束攻擊狀態
    if (currentFrameIndex >= attackAnimation.length) {
      isAttacking = false;
    }
    return; // 正在攻擊時，不執行後續的移動和待機邏輯
  }

  // --- 跳躍物理計算 ---
  if (isJumping) {
    velocityY += gravity; // 施加重力
    characterY += velocityY; // 更新Y座標

    // 如果角色落地
    if (characterY >= groundY) {
      characterY = groundY; // 將Y座標固定在地面上
      velocityY = 0;
      isJumping = false; // 結束跳躍狀態
    }
  }

  // 根據按鍵更新角色X座標
  // 當角色不在跳躍時，才能左右移動
  if (!isJumping && !isAttacking) {
    if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 翻滾速度
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 翻滾速度
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 跑步速度
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 跑步速度
  } else if (keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 3;
  } else if (keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 3;
  }

  }
  // 防止角色走出畫布邊界
  // 我們使用較寬的走路畫格寬度來計算，確保角色身體不會超出邊界
  const characterHalfWidth = walkFrameWidth / 2;
  characterX = constrain(characterX, characterHalfWidth, width - characterHalfWidth);

  // 檢查方向鍵
  if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    if (isJumping) {
      // 如果在跳躍中，優先顯示跳躍動畫
      currentFrameIndex = min(floor(jumpAnimation.length * 0.75), jumpAnimation.length - 1); // 跳躍中途的幀
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(jumpAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(jumpAnimation[currentFrameIndex], characterX, characterY);
      }
      return; // 提前結束draw函式
    }
    // 向右翻滾
    if (lastAnimationType !== 'rollRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollRight';
    }
    currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;
    image(rollAnimation[currentFrameIndex], characterX, characterY);
  } else if (keyIsDown(UP_ARROW) && !isJumping) {
    // 觸發跳躍
    isJumping = true;
    velocityY = jumpForce;
    lastAnimationType = 'jump';
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    // 向左翻滾
    if (lastAnimationType !== 'rollLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollLeft';
    }
    currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;

    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(rollAnimation[currentFrameIndex], 0, 0); 
    pop(); // 恢復原本的繪圖狀態
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    // 向右跑
    if (lastAnimationType !== 'runRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'runRight';
    }
    currentFrameIndex = floor(frameCount / 4) % runAnimation.length;
    image(runAnimation[currentFrameIndex], characterX, characterY);
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    // 向左跑
    if (lastAnimationType !== 'runLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'runLeft';
    }
    currentFrameIndex = floor(frameCount / 4) % runAnimation.length;

    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系 
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(runAnimation[currentFrameIndex], 0, 0);
    pop(); // 恢復原本的繪圖狀態
  } else if (keyIsDown(RIGHT_ARROW)) {
    // 向右走
    // 播放走路動畫
    if (lastAnimationType !== 'walkRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkRight';
    }
    currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
    image(walkAnimation[currentFrameIndex], characterX, characterY);
  } else if (keyIsDown(LEFT_ARROW)) {
    // 向左移動
    // 播放走路動畫
    if (lastAnimationType !== 'walkLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkLeft';
    }
    currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
    
    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(walkAnimation[currentFrameIndex], 0, 0); 
    pop(); // 恢復原本的繪圖狀態
  } else {
    // 如果正在跳躍，顯示跳躍動畫
    if (isJumping) {
      // 根據垂直速度決定播放哪一幀，模擬上升和下降的樣子
      if (velocityY < -5) currentFrameIndex = 1; // 上升
      else if (velocityY > 5) currentFrameIndex = 2; // 下降
      else currentFrameIndex = 0; // 最高點
      
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(jumpAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(jumpAnimation[currentFrameIndex], characterX, characterY);
      }
      return; // 提前結束，不執行待機動畫
    }
    // 播放待機動畫
    if (lastAnimationType !== 'stand') {
      currentFrameIndex = 0;
      lastAnimationType = 'stand';
    }
    currentFrameIndex = floor(frameCount / 6) % standAnimation.length;
    if (direction === -1) {
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(standAnimation[currentFrameIndex], 0, 0);
      pop();
    } else {
      image(standAnimation[currentFrameIndex], characterX, characterY);
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // 當按下空白鍵，且角色不在跳躍或攻擊中時，觸發攻擊
  if (key === ' ' && !isJumping && !isAttacking) {
    isAttacking = true;
    currentFrameIndex = 0; // 從第一幀開始播放
    lastAnimationType = 'attack';
  }
}
