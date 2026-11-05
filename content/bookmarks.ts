export type Bookmark = { title: string; url: string };

export const bookmarks: { group: string; items: Bookmark[] }[] = [
  {
    group: "Speech and speakers",
    items: [
      { title: "AMI Corpus", url: "https://groups.inf.ed.ac.uk/ami/corpus/" },
      { title: "edinburghcstr/ami dataset", url: "https://huggingface.co/datasets/edinburghcstr/ami" },
      { title: "sherpa-onnx: offline speech tools using next-gen Kaldi", url: "https://github.com/k2-fsa/sherpa-onnx" },
      { title: "pyannote-audio: neural building blocks for speaker diarization", url: "https://github.com/pyannote/pyannote-audio" },
    ],
  },
  {
    group: "How meeting notes work",
    items: [
      { title: "Voice Interface API Documentation", url: "https://api-docs.wisprflow.ai" },
      { title: "How to know who said what in a meeting", url: "https://wisprflow.ai/notetaker/how-to-know-who-said-what-in-a-meeting" },
      { title: "The live transcript in Notetaker", url: "https://docs.wisprflow.ai/articles/4091106439-the-live-transcript-in-notetaker-beta" },
      { title: "Recording a meeting with Notetaker", url: "https://docs.wisprflow.ai/articles/9238501024-recording-a-meeting-with-notetaker-beta" },
      { title: "How transcription works", url: "https://docs.granola.ai/help-center/taking-notes/transcription" },
      { title: "AI notetaker for in-person meetings", url: "https://wisprflow.ai/notetaker/ai-notetaker-for-in-person-meetings" },
    ],
  },
];
