export type ToolLandingContent = {
  heading: string;
  summary: string;
  useCases: string[];
};

export const TOOL_LANDING_CONTENT: Record<string, ToolLandingContent> = {
  "campaign-url-architect": {
    heading: "Build campaign links without losing the naming system.",
    summary:
      "Campaign URL Architect turns a destination URL and campaign details into a clean tracked link, then keeps recent links in local history so recurring campaigns stay consistent.",
    useCases: [
      "Preparing paid, email, social, or partner campaign URLs before launch.",
      "Checking that UTM values are present, readable, and free of stray spaces.",
      "Reusing previous campaign structures without keeping a separate spreadsheet open.",
    ],
  },
  "case-converter": {
    heading: "Clean up text casing before it lands in production.",
    summary:
      "Case Converter reformats pasted text into common casing styles for labels, filenames, headings, code-adjacent strings, and content cleanup work.",
    useCases: [
      "Turning rough notes into title case, sentence case, camel case, or slug-ready text.",
      "Normalizing lists of labels before moving them into a CMS, design file, or codebase.",
      "Quickly removing casing inconsistencies from copied content.",
    ],
  },
  "color-palette-generator": {
    heading: "Shape a palette before committing it to a design system.",
    summary:
      "Color Palette Generator helps explore color combinations, contrast, gradients, mockups, image inspiration, and saved palettes from one browser workspace.",
    useCases: [
      "Starting brand, landing page, dashboard, or campaign color exploration.",
      "Previewing how a palette behaves in realistic UI and visual compositions.",
      "Exporting reusable color values once the direction feels right.",
    ],
  },
  "color-picker": {
    heading: "Pull exact colors from the image in front of you.",
    summary:
      "Color Picker samples HEX, RGB, and HSL values from uploaded images with a zoomed canvas so reference colors can move straight into design or development.",
    useCases: [
      "Matching a color from a screenshot, logo, product photo, or moodboard.",
      "Checking nearby pixels with a magnified view before copying the final value.",
      "Translating visual references into usable CSS or design-token color formats.",
    ],
  },
  dictate: {
    heading: "Capture spoken notes while the thought is still moving.",
    summary:
      "Dictate provides a local speech-to-text workspace with editable transcripts, playback, and saved history for drafting notes without opening a heavier writing app.",
    useCases: [
      "Drafting rough notes, outlines, messages, or reminders by voice.",
      "Reviewing dictated text, making edits, and listening back for flow.",
      "Keeping short local transcript history for follow-up work.",
    ],
  },
  "dns-checker": {
    heading: "Check DNS propagation from more than one resolver.",
    summary:
      "DNS Checker queries public resolvers in parallel so domain changes can be compared across record types, response values, and lookup timing.",
    useCases: [
      "Verifying A, AAAA, MX, TXT, CNAME, or NS records after a DNS change.",
      "Comparing resolver responses when a domain works in one place but not another.",
      "Spotting propagation gaps before debugging hosting, email, or verification issues.",
    ],
  },
  "font-converter": {
    heading: "Turn font files into practical web and desktop formats.",
    summary:
      "Font Converter batches font uploads, processes supported formats, and produces ready-to-download outputs for front-end builds, design handoff, or asset cleanup.",
    useCases: [
      "Preparing font assets for web projects that need browser-friendly formats.",
      "Converting several font files at once instead of running one-off exports.",
      "Organizing delivered typography assets before adding them to a project.",
    ],
  },
  "heatmap-tracker": {
    heading: "Prototype heatmap ideas before adding analytics infrastructure.",
    summary:
      "Heatmap Tracker lets you place and export local click hotspots on a screenshot, making it useful for demos, design reviews, and early analytics planning.",
    useCases: [
      "Mocking up how click activity could look on a page or product screen.",
      "Annotating a screenshot with interaction hotspots during UX review.",
      "Exporting local heatmap point data for a prototype or proof of concept.",
    ],
  },
  "image-compressor": {
    heading: "Shrink image weight before upload or handoff.",
    summary:
      "Image Compressor processes image batches in the browser, compares savings, and exports individual files or a ZIP for faster pages and cleaner asset delivery.",
    useCases: [
      "Reducing large images before publishing them to a website or CMS.",
      "Compressing a batch of screenshots, product images, or content assets together.",
      "Checking size savings before deciding which output files to keep.",
    ],
  },
  "image-converter": {
    heading: "Convert image formats without leaving the browser.",
    summary:
      "Image Converter changes images into JPG, PNG, WebP, or PDF outputs with batch controls, file previews, and downloadable results.",
    useCases: [
      "Preparing images for a platform that requires a specific file type.",
      "Converting several design, screenshot, or content assets in one pass.",
      "Creating PDFs from image files for sharing, archiving, or quick review.",
    ],
  },
  "image-extractor": {
    heading: "Audit the image assets used on a page.",
    summary:
      "Image Extractor scans a webpage URL for discoverable image assets, groups useful results, and supports single-file or ZIP downloads.",
    useCases: [
      "Reviewing page imagery during content, migration, or redesign work.",
      "Finding source image URLs without manually inspecting markup.",
      "Collecting visible page assets for local analysis or cleanup.",
    ],
  },
  "image-to-text": {
    heading: "Recover text from an image without uploading it elsewhere.",
    summary:
      "Image to Text runs OCR locally in the browser, then provides confidence details, copy controls, and downloads for extracted text.",
    useCases: [
      "Pulling text from screenshots, scanned notes, labels, or image-based documents.",
      "Checking OCR confidence before reusing the extracted result.",
      "Keeping sensitive image-to-text work local to the browser session.",
    ],
  },
  "lorem-ipsum-generator": {
    heading: "Generate placeholder copy at the size you actually need.",
    summary:
      "Lorem Ipsum Generator creates filler text by paragraph, sentence, or word count so mockups and content slots can be tested quickly.",
    useCases: [
      "Filling design comps, wireframes, and prototypes with realistic text volume.",
      "Testing layout behavior for short blurbs, long paragraphs, or repeated sections.",
      "Copying placeholder text without opening a separate document or generator site.",
    ],
  },
  "modular-wireframe-generator": {
    heading: "Assemble page structure before polishing the visual design.",
    summary:
      "Modular Wireframe Generator combines common website sections, variation controls, and export options for fast planning of page layouts.",
    useCases: [
      "Exploring landing page, pricing, feature, gallery, contact, or testimonial structures.",
      "Comparing section variations before committing to a full design pass.",
      "Exporting a rough layout for discussion, documentation, or next-step design work.",
    ],
  },
  "proportion-scaler": {
    heading: "Resize dimensions while keeping the ratio intact.",
    summary:
      "Proportion Scaler calculates proportional width and height values from an original size, making aspect-ratio math quick and copyable.",
    useCases: [
      "Resizing images, embeds, canvases, videos, or design frames without distortion.",
      "Finding a matching dimension when only one side is known.",
      "Checking common ratios before exporting or implementing fixed-format assets.",
    ],
  },
  "redirect-analyzer": {
    heading: "Trace where a URL really goes.",
    summary:
      "Redirect Analyzer follows a URL through status codes, hops, final destinations, and protocol changes so redirect behavior is easier to debug.",
    useCases: [
      "Checking whether a campaign, affiliate, or migrated URL lands in the right place.",
      "Finding extra redirect hops that slow down a page or obscure the final URL.",
      "Confirming HTTP-to-HTTPS upgrades and status codes during SEO cleanup.",
    ],
  },
  "sitemap-robots-explorer": {
    heading: "Map crawl hints from robots.txt and sitemap files.",
    summary:
      "Sitemap Robots Explorer reads a site entry point, discovers sitemap references, scans URLs, and groups discovered paths into useful categories.",
    useCases: [
      "Getting a fast view of a website's public URL structure.",
      "Checking whether robots.txt exposes expected sitemap locations.",
      "Categorizing discovered URLs before a content audit, migration, or technical SEO review.",
    ],
  },
  vectorvault: {
    heading: "Manage SVG icons from a lightweight local library.",
    summary:
      "Vector Vault provides search, preview, editing, upload, and export flows for SVG icons without turning icon cleanup into a larger asset-management task.",
    useCases: [
      "Finding and copying reusable SVG icons during interface design or development.",
      "Editing icon details before export or handoff.",
      "Keeping a practical local icon library for repeated project work.",
    ],
  },
};
