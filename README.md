# 區塊鏈待辦事項清單 (Blockchain Todo List)

這是一個基於以太坊區塊鏈的去中心化待辦事項應用（DApp）。使用者可以新增、完成和刪除待辦事項，所有數據都儲存在區塊鏈上。

## 功能特點

- 新增待辦事項
- 標記待辦事項為完成/未完成
- 刪除待辦事項
- 使用MetaMask進行以太坊錢包連接
- 所有操作都記錄在區塊鏈上

## 技術棧

- Solidity (智能合約開發)
- Ethers.js (區塊鏈互動)
- Hardhat (開發框架)
- Bootstrap (UI框架)
- jQuery (DOM操作)
- MetaMask (以太坊錢包)

## 智能合約功能

- `createTask(string memory _content)`: 創建新的待辦事項
- `toggleCompleted(uint _id)`: 切換待辦事項的完成狀態
- `deleteTask(uint _id)`: 刪除待辦事項
- `getTask(uint _id)`: 獲取待辦事項詳情

## 前置需求

- Node.js (建議版本 >= 14.0.0)
- MetaMask 瀏覽器擴展
- 本地開發環境（Hardhat Network）

## 安裝與設置

1. 克隆專案：
   ```bash
   git clone [專案URL]
   cd eth-todo-list
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 編譯合約：
   ```bash
   npx hardhat compile
   ```

4. 部署合約：
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. 設定 MetaMask：
   - 網路設置：
     - 網路名稱：Localhost 8545
     - RPC URL：http://127.0.0.1:8545
     - Chain ID：1337
     - 貨幣符號：ETH
   - 導入測試帳戶私鑰

6. 運行前端：
   ```bash
   npm run dev
   ```

## 專案結構

```
eth-todo-list/
├── contracts/          # 智能合約
│   └── TodoList.sol    # 待辦事項合約
├── scripts/            # 部署腳本
│   └── deploy.js       
├── src/               
│   ├── app.js         # 前端應用邏輯
│   ├── index.html     # 主頁面
│   └── artifacts/     # 編譯後的合約 ABI
├── test/              # 測試檔案
└── hardhat.config.js  # Hardhat 配置
```

## 使用說明

1. 確保 MetaMask 已連接到本地網路
2. 在輸入框輸入待辦事項內容並按 Enter 新增
3. 點擊複選框可標記完成/未完成
4. 點擊 X 按鈕可刪除任務
5. 每個操作都需要通過 MetaMask 確認交易

## 常見問題排除

1. MetaMask 連接問題：
   - 確認網路設置正確（Chain ID: 1337）
   - 確保本地節點正在運行
   - 重新載入頁面並重新連接錢包

2. 交易失敗：
   - 檢查帳戶是否有足夠的測試 ETH
   - 確認是否正確連接到正確網路
   - 檢查 console 錯誤訊息

## 開發注意事項

- 所有合約互動都是非同步的
- 每次合約操作都會觸發相應的事件
- 使用 `try-catch` 處理所有合約調用
- 確保妥善處理交易等待狀態
- 測試時用Ganache (本地區塊鏈)不需要花自己的錢