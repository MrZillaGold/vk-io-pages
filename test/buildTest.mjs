import pages from "../lib/PageBuilder.js";
import { test } from "./tests.mjs";

const { PagesBuilder, pagesStorage } = pages;

test(PagesBuilder, pagesStorage, "CommonJS");
