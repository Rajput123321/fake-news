/**
 * Fake News Detection Engine
 * 
 * This module implements a client-side heuristic-based fake news detector
 * that simulates TF-IDF feature extraction and Random Forest classification.
 * 
 * In a production environment, you'd replace this with an API call to a
 * Python backend running scikit-learn with a trained model.
 */

// Common clickbait and sensationalist patterns
const CLICKBAIT_PATTERNS = [
  /you won't believe/i,
  /shocking/i,
  /breaking.*news/i,
  /exposed/i,
  /secret.*(they|government|media)/i,
  /what they don't want you to know/i,
  /this changes everything/i,
  /gone wrong/i,
  /mind.?blowing/i,
  /unbelievable/i,
  /conspiracy/i,
  /cover.?up/i,
  /wake up/i,
  /mainstream media/i,
  /big pharma/i,
  /miracle cure/i,
  /doctors hate/i,
  /one weird trick/i,
  /exposed the truth/i,
  /the real story/i,
];

// Emotional manipulation indicators
const EMOTIONAL_PATTERNS = [
  /!!!+/,
  /\?\?\?+/,
  /ALL CAPS/,
  /EXPOSED/,
  /URGENT/,
  /WARNING/,
  /SHARE THIS/,
  /before it's deleted/i,
  /spread the word/i,
  /they're hiding/i,
];

// Credibility indicators (positive signals)
const CREDIBILITY_PATTERNS = [
  /according to/i,
  /research(ers)? (found|shows|suggests)/i,
  /study published/i,
  /peer.?reviewed/i,
  /university of/i,
  /journal of/i,
  /reuters|associated press|ap news/i,
  /official statement/i,
  /data (shows|suggests|indicates)/i,
  /evidence (suggests|shows|indicates)/i,
];

export interface AnalysisResult {
  prediction: 'real' | 'fake' | 'uncertain';
  confidence: number; // 0-1
  fakeProbability: number; // 0-1
  realProbability: number; // 0-1
  features: {
    clickbaitScore: number;
    emotionalScore: number;
    credibilityScore: number;
    capsRatio: number;
    punctuationDensity: number;
    avgSentenceLength: number;
    vocabularyRichness: number;
  };
  flaggedPatterns: string[];
  positiveSignals: string[];
}

/**
 * Analyze text for fake news indicators
 * Simulates TF-IDF + Random Forest classification pipeline
 */
export function analyzeText(text: string): AnalysisResult {
  if (!text.trim()) {
    return getEmptyResult();
  }

  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));

  // Feature extraction (simulating TF-IDF features)
  const clickbaitMatches = CLICKBAIT_PATTERNS.filter(p => p.test(text));
  const emotionalMatches = EMOTIONAL_PATTERNS.filter(p => p.test(text));
  const credibilityMatches = CREDIBILITY_PATTERNS.filter(p => p.test(text));

  const clickbaitScore = Math.min(clickbaitMatches.length / 5, 1);
  const emotionalScore = Math.min(emotionalMatches.length / 4, 1);
  const credibilityScore = Math.min(credibilityMatches.length / 4, 1);

  // Text statistics
  const upperCaseChars = (text.match(/[A-Z]/g) || []).length;
  const totalAlpha = (text.match(/[a-zA-Z]/g) || []).length;
  const capsRatio = totalAlpha > 0 ? upperCaseChars / totalAlpha : 0;

  const punctuation = (text.match(/[!?]/g) || []).length;
  const punctuationDensity = words.length > 0 ? punctuation / words.length : 0;

  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  const vocabularyRichness = words.length > 0 ? uniqueWords.size / words.length : 0;

  // Simulated Random Forest ensemble decision
  // Combines multiple "weak classifiers" (heuristics)
  const fakeSignals = [
    clickbaitScore * 0.3,
    emotionalScore * 0.25,
    Math.max(0, capsRatio - 0.15) * 2 * 0.15,
    Math.min(punctuationDensity * 3, 1) * 0.15,
    Math.max(0, 1 - vocabularyRichness) * 0.05,
    (avgSentenceLength < 8 ? 0.5 : 0) * 0.1,
  ];

  const realSignals = [
    credibilityScore * 0.35,
    (vocabularyRichness > 0.6 ? 0.5 : 0) * 0.2,
    (avgSentenceLength > 15 && avgSentenceLength < 35 ? 0.5 : 0) * 0.15,
    (capsRatio < 0.1 ? 0.5 : 0) * 0.15,
    (punctuationDensity < 0.05 ? 0.5 : 0) * 0.15,
  ];

  const fakeScore = fakeSignals.reduce((a, b) => a + b, 0);
  const realScore = realSignals.reduce((a, b) => a + b, 0);

  const totalScore = fakeScore + realScore || 1;
  const fakeProbability = Math.min(Math.max(fakeScore / totalScore + (fakeScore > realScore ? 0.1 : -0.1), 0.05), 0.95);
  const realProbability = 1 - fakeProbability;

  const prediction: 'real' | 'fake' | 'uncertain' =
    fakeProbability > 0.6 ? 'fake' :
    realProbability > 0.6 ? 'real' : 'uncertain';

  const confidence = Math.abs(fakeProbability - 0.5) * 2;

  return {
    prediction,
    confidence,
    fakeProbability: Math.round(fakeProbability * 1000) / 1000,
    realProbability: Math.round(realProbability * 1000) / 1000,
    features: {
      clickbaitScore: Math.round(clickbaitScore * 100) / 100,
      emotionalScore: Math.round(emotionalScore * 100) / 100,
      credibilityScore: Math.round(credibilityScore * 100) / 100,
      capsRatio: Math.round(capsRatio * 100) / 100,
      punctuationDensity: Math.round(punctuationDensity * 100) / 100,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      vocabularyRichness: Math.round(vocabularyRichness * 100) / 100,
    },
    flaggedPatterns: clickbaitMatches.map(p => p.source).concat(emotionalMatches.map(p => p.source)),
    positiveSignals: credibilityMatches.map(p => p.source),
  };
}

function getEmptyResult(): AnalysisResult {
  return {
    prediction: 'uncertain',
    confidence: 0,
    fakeProbability: 0.5,
    realProbability: 0.5,
    features: {
      clickbaitScore: 0,
      emotionalScore: 0,
      credibilityScore: 0,
      capsRatio: 0,
      punctuationDensity: 0,
      avgSentenceLength: 0,
      vocabularyRichness: 0,
    },
    flaggedPatterns: [],
    positiveSignals: [],
  };
}
