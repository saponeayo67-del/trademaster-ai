export class CoachVoice {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static isSpeaking = false;
  private static onStateChangeListeners: ((speaking: boolean) => void)[] = [];

  public static addListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
  }

  public static removeListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
  }

  private static notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach(l => l(speaking));
  }

  public static speak(text: string) {
    if (!this.synth) return;

    this.stop();

    // Clean markdown characters, emojis and tags for clear speech synthesis
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95; // Slightly deeper, authoritative mentor pitch

    // Try to find a French voice
    const voices = this.synth.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Thomas') || v.name.includes('Henri') || v.name.includes('Google') || v.name.includes('Natural')));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => this.notify(false);
    utterance.onerror = () => this.notify(false);

    this.synth.speak(utterance);
  }

  public static stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.notify(false);
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}
