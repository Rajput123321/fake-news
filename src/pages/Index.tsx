import { useState } from "react";
import { analyzeText, type AnalysisResult } from "@/lib/fake-news-detector";
import { ProbabilityGauge } from "@/components/ProbabilityGauge";
import { FeatureBar } from "@/components/FeatureBar";
import { ResultBadge } from "@/components/ResultBadge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Trash2, Zap, Brain, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";

const SAMPLE_FAKE = `BREAKING!!! You won't believe what they're hiding from you! The government has been EXPOSED for covering up the REAL story about miracle cures that doctors hate! SHARE THIS before it's deleted!!! Big pharma doesn't want you to know this one weird trick that changes everything!!!`;

const SAMPLE_REAL = `According to a study published in the Journal of Medicine, researchers at the University of Cambridge found that regular exercise is associated with improved cardiovascular health. The peer-reviewed research, based on data from over 10,000 participants, suggests that moderate physical activity reduces the risk of heart disease by approximately 30 percent.`;

export default function Index() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    // Simulate processing delay for UX
    setTimeout(() => {
      setResult(analyzeText(text));
      setIsAnalyzing(false);
    }, 800);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  const loadSample = (sample: string) => {
    setText(sample);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <div className="gradient-primary rounded-lg p-2">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Fake News Detector
            </h1>
            <p className="text-xs text-muted-foreground">
              TF-IDF + Random Forest Classification
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Analyze News for <span className="text-gradient">Authenticity</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Paste any news article or headline below. Our ML-powered engine extracts linguistic features
            and classifies the content using ensemble heuristics inspired by TF-IDF and Random Forest.
          </p>
        </section>

        {/* Input Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste a news article, headline, or social media post here..."
              className="min-h-[160px] resize-none text-base font-sans"
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="gradient-primary text-primary-foreground border-0 gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 animate-pulse" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" /> Analyze Text
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleClear} className="gap-2">
                <Trash2 className="h-4 w-4" /> Clear
              </Button>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              <span className="text-xs text-muted-foreground hidden sm:block">Try samples:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadSample(SAMPLE_FAKE)}
                className="text-destructive text-xs gap-1"
              >
                <AlertTriangle className="h-3 w-3" /> Fake Example
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadSample(SAMPLE_REAL)}
                className="text-accent text-xs gap-1"
              >
                <CheckCircle className="h-3 w-3" /> Real Example
              </Button>
            </div>

            {text && (
              <p className="text-xs text-muted-foreground">
                {text.split(/\s+/).filter(Boolean).length} words · {text.length} characters
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Prediction Badge */}
            <ResultBadge prediction={result.prediction} confidence={result.confidence} />

            {/* Probability Gauges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Probability Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-center gap-10">
                  <ProbabilityGauge
                    value={result.fakeProbability}
                    label="Fake Probability"
                    variant="danger"
                  />
                  <ProbabilityGauge
                    value={result.realProbability}
                    label="Real Probability"
                    variant="success"
                  />
                  <ProbabilityGauge
                    value={result.confidence}
                    label="Model Confidence"
                    variant="warning"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feature Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  Feature Extraction (TF-IDF Inspired)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureBar
                  label="Clickbait Score"
                  value={result.features.clickbaitScore}
                  description="Presence of sensationalist language patterns"
                />
                <FeatureBar
                  label="Emotional Manipulation"
                  value={result.features.emotionalScore}
                  description="Excessive punctuation, caps, and urgency signals"
                />
                <FeatureBar
                  label="Credibility Indicators"
                  value={result.features.credibilityScore}
                  description="References to studies, data, and reputable sources"
                />
                <FeatureBar
                  label="Caps Ratio"
                  value={result.features.capsRatio}
                  description="Proportion of uppercase characters"
                />
                <FeatureBar
                  label="Punctuation Density"
                  value={Math.min(result.features.punctuationDensity, 1)}
                  description="Exclamation and question mark frequency"
                />
                <FeatureBar
                  label="Vocabulary Richness"
                  value={result.features.vocabularyRichness}
                  description="Ratio of unique words to total words"
                />
              </CardContent>
            </Card>

            {/* Flagged Patterns */}
            {(result.flaggedPatterns.length > 0 || result.positiveSignals.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {result.flaggedPatterns.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" /> Red Flags Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.flaggedPatterns.slice(0, 8).map((p, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-mono text-destructive"
                          >
                            {p.replace(/\\/g, '').replace(/\(.*?\)/g, '').slice(0, 30)}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {result.positiveSignals.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-accent">
                        <CheckCircle className="h-4 w-4" /> Credibility Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.positiveSignals.slice(0, 8).map((p, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-mono text-accent"
                          >
                            {p.replace(/\\/g, '').replace(/\(.*?\)/g, '').slice(0, 30)}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-center text-xs text-muted-foreground max-w-xl mx-auto">
              ⚠️ This is a client-side heuristic demo. For production use, deploy a trained 
              scikit-learn pipeline (TF-IDF + RandomForestClassifier) as a backend API.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
