import pages from "../lib/PagesBuilder.js";
import { test } from "./tests.mjs";

const { PagesBuilder, pagesStorage } = pages;

test(PagesBuilder, pagesStorage, "CommonJS");
