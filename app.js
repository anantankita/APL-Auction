const players = [
  { id: 1, name: "Virat Kohli", role: "BAT", nat: "IND", base: 2.0, rating: 94, stats: "Anchor batter, elite chase player, high consistency." },
  { id: 2, name: "Rohit Sharma", role: "BAT", nat: "IND", base: 2.0, rating: 88, stats: "Powerplay hitter, title-winning captaincy profile." },
  { id: 3, name: "Shubman Gill", role: "BAT", nat: "IND", base: 1.5, rating: 91, stats: "Consistent opener, strong against pace and spin." },
  { id: 4, name: "Ruturaj Gaikwad", role: "BAT", nat: "IND", base: 1.5, rating: 87, stats: "Stable opener, strong timing, useful long-innings player." },
  { id: 5, name: "David Warner", role: "BAT", nat: "AUS", base: 1.5, rating: 84, stats: "Left-hand opener, aggressive powerplay option." },
  { id: 6, name: "Faf du Plessis", role: "BAT", nat: "SA", base: 1.0, rating: 82, stats: "Experienced top-order batter, safe auction value." },
  { id: 7, name: "KL Rahul", role: "WK", nat: "IND", base: 2.0, rating: 86, stats: "Keeper-batter, top-order stability, flexible role." },
  { id: 8, name: "Sanju Samson", role: "WK", nat: "IND", base: 1.5, rating: 85, stats: "Explosive keeper, middle-over spin hitter." },
  { id: 9, name: "Jos Buttler", role: "WK", nat: "ENG", base: 2.0, rating: 93, stats: "Explosive opener, match-winner, premium overseas pick." },
  { id: 10, name: "Rishabh Pant", role: "WK", nat: "IND", base: 2.0, rating: 89, stats: "Left-hand keeper, high-impact middle-order hitter." },
  { id: 11, name: "Jasprit Bumrah", role: "BOWL", nat: "IND", base: 2.0, rating: 97, stats: "Death-over specialist, elite economy, wicket-taker." },
  { id: 12, name: "Yuzvendra Chahal", role: "BOWL", nat: "IND", base: 1.0, rating: 84, stats: "Leg-spinner, middle-over wicket threat." },
  { id: 13, name: "Rashid Khan", role: "BOWL", nat: "AFG", base: 2.0, rating: 96, stats: "Mystery spin, lower-order hitting, premium T20 value." },
  { id: 14, name: "Pat Cummins", role: "BOWL", nat: "AUS", base: 2.0, rating: 87, stats: "Pace leader, bounce, useful lower-order runs." },
  { id: 15, name: "Arshdeep Singh", role: "BOWL", nat: "IND", base: 1.0, rating: 83, stats: "Left-arm swing, powerplay plus death overs." },
  { id: 16, name: "Mohammed Siraj", role: "BOWL", nat: "IND", base: 1.0, rating: 82, stats: "Powerplay swing, attacking Indian pace option." },
  { id: 17, name: "Ravindra Jadeja", role: "AR", nat: "IND", base: 2.0, rating: 91, stats: "Spin all-rounder, elite fielder, balance multiplier." },
  { id: 18, name: "Hardik Pandya", role: "AR", nat: "IND", base: 2.0, rating: 90, stats: "Pace all-rounder, finisher, captaincy upside." },
  { id: 19, name: "Glenn Maxwell", role: "AR", nat: "AUS", base: 1.5, rating: 86, stats: "Spin-hitting all-rounder, high variance, high ceiling." },
  { id: 20, name: "Sunil Narine", role: "AR", nat: "WI", base: 1.0, rating: 88, stats: "Economical mystery spin, surprise opener value." },
  { id: 21, name: "Washington Sundar", role: "AR", nat: "IND", base: 0.7, rating: 78, stats: "Powerplay off-spin, budget Indian all-rounder." },
  { id: 22, name: "Shardul Thakur", role: "AR", nat: "IND", base: 0.7, rating: 77, stats: "Wicket-taking seamer, lower-order hitting." },
  { id: 23, name: "Mitchell Starc", role: "BOWL", nat: "AUS", base: 1.5, rating: 89, stats: "Left-arm pace, swing, death-over threat." },
  { id: 24, name: "Trent Boult", role: "BOWL", nat: "NZ", base: 1.5, rating: 87, stats: "New-ball swing, left-arm angle, playoff temperament." },
];

const roleLabels = { BAT: "Batter", BOWL: "Bowler", AR: "All-rounder", WK: "Wicket-keeper" };
const ideal = { BAT: 4, BOWL: 3, AR: 3, WK: 1 };

const state = {
  budget: 100,
  squad: [],
  filter: "all",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function cr(value) {
  return `Rs ${value.toFixed(1)} Cr`;
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2600);
}

function availablePlayers() {
  return players.filter((player) => !state.squad.some((squadPlayer) => squadPlayer.id === player.id) && (state.filter === "all" || player.role === state.filter));
}

function roleCounts() {
  return state.squad.reduce(
    (counts, player) => {
      counts[player.role] += 1;
      return counts;
    },
    { BAT: 0, BOWL: 0, AR: 0, WK: 0 },
  );
}

function squadScore() {
  if (!state.squad.length) return 0;
  const ratingScore = state.squad.reduce((sum, player) => sum + player.rating, 0) / 11;
  const counts = roleCounts();
  const balancePenalty =
    Math.abs(ideal.BAT - counts.BAT) * 3 +
    Math.abs(ideal.BOWL - counts.BOWL) * 3 +
    Math.abs(ideal.AR - counts.AR) * 2 +
    Math.abs(ideal.WK - counts.WK) * 4;
  return Math.max(0, Math.round(ratingScore - balancePenalty + state.budget * 0.12));
}

function valueScore(player, bid = player.base) {
  const counts = roleCounts();
  const gapBoost = Math.max(0, ideal[player.role] - counts[player.role]) * 7;
  const pricePenalty = Math.max(0, bid - player.base) * 4;
  const indianBoost = player.nat === "IND" ? 4 : 0;
  return Math.round(player.rating + gapBoost + indianBoost - pricePenalty);
}

function renderPlayers() {
  const grid = $("#playerGrid");
  const list = availablePlayers();
  if (!list.length) {
    grid.innerHTML = '<div class="player-card">No players available in this filter.</div>';
    return;
  }

  grid.innerHTML = list
    .map(
      (player) => `
        <article class="player-card">
          <div class="player-top">
            <div class="avatar av-${player.role}">${initials(player.name)}</div>
            <div>
              <div class="player-name">${player.name}</div>
              <div class="player-meta">${player.nat}</div>
              <span class="role-tag role-${player.role}">${roleLabels[player.role]}</span>
            </div>
            <div class="base-price">${cr(player.base)}</div>
          </div>
          <p class="player-stats">${player.stats}</p>
          <div class="bid-row">
            <input id="bid-${player.id}" type="number" value="${player.base.toFixed(1)}" min="${player.base.toFixed(1)}" max="30" step="0.5" aria-label="Bid for ${player.name}" />
            <button class="bid-button" data-bid="${player.id}">Buy</button>
            <button class="ask-button" data-ask="${player.id}">Advisor</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSquad() {
  const slots = Array.from({ length: 11 }, (_, index) => state.squad[index] ?? null);
  $("#squadList").innerHTML = slots
    .map((player, index) => {
      if (!player) {
        return `<div class="squad-slot slot-empty"><span class="slot-num">${index + 1}</span><span>Empty slot</span></div>`;
      }
      return `
        <div class="squad-slot">
          <span class="slot-num">${index + 1}</span>
          <div>
            <div class="slot-name">${player.name}</div>
            <div class="slot-role">${roleLabels[player.role]}</div>
          </div>
          <span class="slot-price">${cr(player.bidPrice)}</span>
          <button class="remove-button" data-remove="${player.id}" aria-label="Remove ${player.name}">x</button>
        </div>
      `;
    })
    .join("");

  const counts = roleCounts();
  $("#budgetValue").textContent = cr(state.budget);
  $("#squadValue").textContent = `${state.squad.length} / 11`;
  $("#teamScore").textContent = squadScore();
  $("#batCount").textContent = counts.BAT;
  $("#bowlCount").textContent = counts.BOWL;
  $("#arCount").textContent = counts.AR;
  $("#wkCount").textContent = counts.WK;
  $("#roleMeter").innerHTML = `
    <span class="dot bat" style="flex:${counts.BAT}"></span>
    <span class="dot bowl" style="flex:${counts.BOWL}"></span>
    <span class="dot ar" style="flex:${counts.AR}"></span>
    <span class="dot wk" style="flex:${counts.WK}"></span>
    <span style="flex:${Math.max(0, 11 - state.squad.length)}"></span>
  `;
}

function setAdvisor(message) {
  $("#advisorText").textContent = message;
}

function buyPlayer(id) {
  const player = players.find((item) => item.id === id);
  const bid = Number($(`#bid-${id}`).value);
  if (!player || Number.isNaN(bid)) return;
  if (bid < player.base) {
    toast(`Bid must be at least ${cr(player.base)}.`);
    return;
  }
  if (bid > state.budget) {
    toast(`Not enough budget. You have ${cr(state.budget)} left.`);
    return;
  }
  if (state.squad.length >= 11) {
    toast("Squad is full. Remove a player first.");
    return;
  }

  state.budget = Math.round((state.budget - bid) * 10) / 10;
  state.squad.push({ ...player, bidPrice: bid });
  toast(`${player.name} bought for ${cr(bid)}.`);
  setAdvisor(adviceAfterBuy(player, bid));
  renderAll();
}

function removePlayer(id) {
  const player = state.squad.find((item) => item.id === id);
  if (!player) return;
  state.budget = Math.round((state.budget + player.bidPrice) * 10) / 10;
  state.squad = state.squad.filter((item) => item.id !== id);
  toast(`${player.name} removed. Budget restored.`);
  renderAll();
}

function biggestGap() {
  const counts = roleCounts();
  return Object.keys(ideal)
    .map((role) => ({ role, gap: ideal[role] - counts[role] }))
    .sort((a, b) => b.gap - a.gap)[0];
}

function adviceForPlayer(id) {
  const player = players.find((item) => item.id === id);
  const bid = Number($(`#bid-${id}`)?.value ?? player.base);
  const score = valueScore(player, bid);
  const gap = biggestGap();
  const maxBid = Math.min(state.budget, Math.max(player.base, player.base + (score - 80) / 10));
  const verdict = score >= 95 ? "Strong buy" : score >= 84 ? "Good buy" : score >= 74 ? "Situational buy" : "Avoid overpaying";
  const gapLine = gap.role === player.role ? "He directly fills your biggest squad gap." : `Your biggest gap is ${roleLabels[gap.role]}, so only buy if the price stays disciplined.`;
  setAdvisor(`${verdict}: ${player.name} at ${cr(bid)}. ${gapLine} My local max bid is around ${cr(Math.max(player.base, Math.round(maxBid * 10) / 10))}. Reason: rating ${player.rating}, role need, nationality mix, and current budget.`);
}

function adviceAfterBuy(player, bid) {
  const counts = roleCounts();
  const next = biggestGap();
  return `${player.name} is in. You spent ${cr(bid)} and have ${cr(state.budget)} left. Current shape: ${counts.BAT} bat, ${counts.BOWL} bowl, ${counts.AR} AR, ${counts.WK} WK. Next priority: ${roleLabels[next.role]}.`;
}

function analyseSquad() {
  if (!state.squad.length) {
    setAdvisor("Add at least one player first. Start with a premium opener, wicket-taker, or all-rounder.");
    return;
  }
  const counts = roleCounts();
  const gap = biggestGap();
  const overseas = state.squad.filter((player) => player.nat !== "IND").length;
  setAdvisor(`Squad analysis: team score ${squadScore()}/100. You have ${counts.BAT} batters, ${counts.BOWL} bowlers, ${counts.AR} all-rounders, and ${counts.WK} keeper. Biggest need: ${roleLabels[gap.role]}. Overseas count is ${overseas}, so keep enough Indian core if this were a real auction.`);
}

function suggestNext() {
  const gap = biggestGap();
  const candidates = availablePlayers()
    .map((player) => ({ player, score: valueScore(player) + (player.role === gap.role ? 10 : 0) }))
    .sort((a, b) => b.score - a.score);
  const best = candidates[0]?.player;
  if (!best) {
    setAdvisor("No players left in the pool. Use final verdict to judge your squad.");
    return;
  }
  setAdvisor(`Suggested next buy: ${best.name}. Target role: ${roleLabels[gap.role]}. Start near ${cr(best.base)} and avoid crossing ${cr(Math.min(state.budget, best.base + 3))}. He gives the best mix of role need, rating, and price in the current pool.`);
}

function finalVerdict() {
  const score = squadScore();
  if (state.squad.length < 5) {
    setAdvisor("Build at least 5 players before final verdict. Right now the sample is too small to judge.");
    return;
  }
  const label = score >= 82 ? "title contender" : score >= 68 ? "playoff hopeful" : "needs repair";
  const gap = biggestGap();
  setAdvisor(`Final verdict: this squad is a ${label}. Score: ${score}/100. Best strength is your top-end quality; biggest risk is ${roleLabels[gap.role]} depth. If you have budget left, spend it on that role before chasing another star.`);
}

function resetAll() {
  state.budget = 100;
  state.squad = [];
  state.filter = "all";
  $$(".filter").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
  setAdvisor("Squad reset. Start fresh with one premium player, then use Suggest next.");
  renderAll();
}

function renderAll() {
  renderPlayers();
  renderSquad();
}

$$(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    $$(".filter").forEach((item) => item.classList.toggle("active", item === button));
    renderPlayers();
  });
});

$("#playerGrid").addEventListener("click", (event) => {
  const buy = event.target.closest("[data-bid]");
  const ask = event.target.closest("[data-ask]");
  if (buy) buyPlayer(Number(buy.dataset.bid));
  if (ask) adviceForPlayer(Number(ask.dataset.ask));
});

$("#squadList").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (remove) removePlayer(Number(remove.dataset.remove));
});

$("#analyseButton").addEventListener("click", analyseSquad);
$("#suggestButton").addEventListener("click", suggestNext);
$("#verdictButton").addEventListener("click", finalVerdict);
$("#resetButton").addEventListener("click", resetAll);

renderAll();
