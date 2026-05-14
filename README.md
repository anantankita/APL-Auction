# APL Auction

An interactive cricket auction simulator built with React and Tailwind CSS. Test your tactical skills by building a balanced 11-player squad while managing a limited budget of Rs 100 Crore.

## 🚀 Features

- **Real-time Strategy Advisor**: A built-in local advisor that analyzes your squad's balance, budget, and identifies the biggest gaps in your lineup.
- **Dynamic Auction Mechanics**:
  - **Budget Tracking**: Real-time updates as you spend on players.
  - **Role Balancing**: Track your distribution of Batters, Bowlers, All-rounders, and Wicket-keepers.
  - **Team Scoring**: A proprietary "Squad Score" that evaluates team quality based on player ratings, role balance, and remaining budget.
- **Interactive Player Pool**: Filter players by role and use the "Advisor" button to get specific bid limit recommendations for each player.
- **Responsive Design**: Polished dark-mode UI that works across desktop and mobile devices.

## 🏏 How to Play

1. **Pick your Core**: Start by selecting high-rated players to anchor your team.
2. **Consult the Advisor**: Before buying, click the **Advisor** button on a player card to see the calculated "Max Bid" based on your current needs.
3. **Balance the XI**: Try to aim for the ideal composition:
   - 4 Batters
   - 3 Bowlers
   - 3 All-rounders
   - 1 Wicket-keeper
4. **Win the Auction**: Complete your 11-player squad with the highest possible Team Score.

## 🛠️ Technical Details

- **Framework**: React 19
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Animations**: Motion (framer-motion)
- **Deployment**: Optimized for Google Cloud Run via AI Studio.

## 📂 Project Structure

- `src/App.tsx`: Main application logic, state management, and strategy algorithm.
- `src/index.css`: Custom theme variables and global styles.
- `metadata.json`: Application metadata for the AI Studio environment.

## 🛡️ Security

This application is designed as a standalone simulator. It does not require external API keys or server-side databases, making it secure and fast as all calculations happen locally in your browser.
