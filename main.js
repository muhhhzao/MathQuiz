// ============================================
//  MATHQUIZ — GAME CONTROLLER (main.js)
// ============================================

const Game = {
  state: null,

  init() {
    this.state = SaveSystem.load();
    Particles.init();
    AudioSystem.init(this.state.audioEnabled);
    this._bindAudioToggle();
    this.showScreen('screen-home');
    HomeScreen.init(this.state);
    AudioSystem.playBg();
  },

  // ---- NAVEGAÇÃO ENTRE TELAS ----
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
      // Pequeno delay para o CSS transition funcionar
      requestAnimationFrame(() => {
        target.classList.add('active');
      });
    }
  },

  // ---- TOGGLE DE ÁUDIO ----
  _bindAudioToggle() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.state = SaveSystem.toggleAudio(this.state);
      AudioSystem.toggle(this.state);
    });
  },

  // ---- INICIAR JOGO (novo) ----
  startGame() {
    HomeScreen.teardown();
    this.showScreen('screen-map');
  },

  // ---- CONTINUAR (progresso salvo) ----
  continueGame() {
    HomeScreen.teardown();
    this.showScreen('screen-map');
  },

  // ---- INICIAR FASE ----
  startPhase(phaseId) {
    const phaseData = this.state.phases[phaseId - 1];
    if (!phaseData.unlocked) return;
    console.log(`Iniciando fase ${phaseId}`);
    this.showScreen('screen-quiz');
  },

  // ---- FINALIZAR FASE ----
  finishPhase(phaseId, hits, timeBonus, comboBonus) {
    const stars = calcStars(hits);
    const score = calcScore(hits, timeBonus, comboBonus);
    this.state = SaveSystem.updatePhase(this.state, phaseId, stars, score);
    this.showScreen('screen-result');
  }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => Game.init());
