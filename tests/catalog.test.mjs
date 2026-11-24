import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { parseCatalog, parseImplementedCases, parseVersion } from "../scripts/catalog.mjs";

const TOOL_SWIFT = `
enum ToolInput: Hashable {
    var isImplemented: Bool {
        switch self {
        case .dropFiles, .live:
            false
        case .link, .trimVideo, .companionApp,
             .mac:
            true
        }
    }
}
`;
const CASES = parseImplementedCases(TOOL_SWIFT);

const entry = (fields) => `        Tool(${fields}),\n`;
const DOWNLOAD = entry(
  'name: "Download Video", category: .video, symbol: "arrow.down.to.line",\n             tagline: "Save videos from YouTube, X, TikTok and more.", input: .link',
);
const CHANGE_SPEED = entry(
  'name: "Change Speed", category: .video, symbol: "speedometer",\n             tagline: "Speed up or slow down videos.",\n             input: drop("a Video", "Drop a video.", "film")',
);
const DAMAGED = entry(
  'name: "Fix \\"App Is Damaged\\"", category: .mac, symbol: "exclamationmark.triangle",\n             tagline: "Check who made an app.", input: .mac(.fixDamagedApp)',
);
const CONVERT = entry(
  'name: "Convert Audio", category: .audio, symbol: "arrow.triangle.2.circlepath", tagline: "Convert audio.", input: .dropFiles(title: "Drop", hint: "h", symbol: "waveform")',
);
const RECORD = entry(
  'name: "Record Audio", category: .audio, symbol: "mic", tagline: "Record your voice.",\n             input: .live(symbol: "mic", idle: "Ready", action: "Record")',
);
const SAMPLE = DOWNLOAD + CHANGE_SPEED + DAMAGED + CONVERT + RECORD;

const parse = (source) => parseCatalog(source, CASES);

test("reads name, category and tagline of every tool", () => {
  const tools = parse(SAMPLE);
  assert.equal(tools.length, 5);
  assert.deepEqual(tools.at(0), {
    name: "Download Video",
    category: "Video",
    tagline: "Save videos from YouTube, X, TikTok and more.",
    working: true,
  });
  assert.equal(tools.at(3)?.category, "Audio");
});

test("a tool works only when the app's own isImplemented says so", () => {
  const working = Object.fromEntries(parse(SAMPLE).map((tool) => [tool.name, tool.working]));
  assert.deepEqual(working, {
    "Download Video": true,
    "Change Speed": false,
    'Fix "App Is Damaged"': true,
    "Convert Audio": false,
    "Record Audio": false,
  });
});

test("an input case isImplemented does not list is an error, never a working tool", () => {
  assert.throws(() => parse(DOWNLOAD.replace("input: .link", "input: .pasteText")), /does not list "\.pasteText"/);
});

test("an entry it cannot read is an error, not a silent gap", () => {
  const reordered = CHANGE_SPEED.replace(
    'category: .video, symbol: "speedometer",',
    'symbol: "speedometer", category: .video,',
  );
  assert.throws(() => parse(DOWNLOAD + reordered), /Read 1 of 2 tools/);
  assert.throws(() => parse(DOWNLOAD + CONVERT.replace("Tool(name:", ".init(name:")), /Read 1 of 2 tools/);
  assert.throws(
    () => parse(DOWNLOAD + CONVERT.replace('name: "Convert Audio"', "name: Self.convertName")),
    /Read 1 of 2 tools/,
  );
  assert.throws(() => parse("enum ToolCatalog {}"), /format has changed/);
});

test("an entry wrapped onto its own lines is still read", () => {
  assert.equal(parse(DOWNLOAD.replace("Tool(name:", "Tool(\n            name:")).length, 1);
});

test("commented-out entries are not tools", () => {
  const commented = `        // ${CONVERT.trim()}\n        /* ${RECORD.trim()} */\n`;
  assert.deepEqual(
    parse(DOWNLOAD + commented).map((tool) => tool.name),
    ["Download Video"],
  );
});

test("a Swift escape it does not understand is an error", () => {
  assert.throws(() => parse(CONVERT.replace("Convert audio.", "It\\u{2019}s short.")), /Swift escape/);
  assert.throws(() => parse(CONVERT.replace("Convert audio.", "\\(count) lines.")), /Swift escape/);
});

test("an unknown category is an error", () => {
  assert.throws(() => parse(DOWNLOAD.replace("category: .video", "category: .developer")), /Unknown category/);
});

test("isImplemented in an unknown shape is an error", () => {
  assert.throws(() => parseImplementedCases("enum ToolInput {}"), /isImplemented/);
  assert.throws(
    () => parseImplementedCases(TOOL_SWIFT.replace(".link, .trimVideo,", ".link, .mac(.keepAwake),")),
    /isImplemented/,
  );
  assert.throws(
    () => parseImplementedCases(TOOL_SWIFT.replace("            false", "            true && false")),
    /isImplemented/,
  );
});

test("a companion app card is a link to that app, not a tool", () => {
  const folio = entry(
    'name: "Folio", category: .docs, symbol: "doc.richtext",\n             tagline: "Read PDFs. Opens Folio.",\n             input: .companionApp(.folio)',
  );
  assert.deepEqual(parse(DOWNLOAD + folio).at(1), {
    name: "Folio",
    category: "Docs",
    tagline: "Read PDFs. Opens Folio.",
    companion: "folio",
  });
});

test("reads the app version", () => {
  assert.equal(parseVersion('enum AppVersion {\n    static let current = "0.12.2"\n}'), "0.12.2");
  assert.throws(() => parseVersion("nothing here"), /AppVersion/);
});

test("reads the real catalog of release 0.16.0", async () => {
  const fixture = (name) => readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
  const tools = parseCatalog(
    await fixture("ToolCatalog-0.16.0.swift"),
    parseImplementedCases(await fixture("Tool-0.16.0.swift")),
  );
  assert.equal(tools.length, 46);
  assert.equal(tools.filter((tool) => tool.working).length, 37);
  assert.ok(tools.every((tool) => tool.category !== "Text & Speech" && tool.category !== "Files"));
});
