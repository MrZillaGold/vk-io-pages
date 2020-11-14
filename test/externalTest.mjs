import { PagesBuilder, pagesStorage } from "../src/PagesBuilder.mjs";
import { test } from "./tests.mjs";

test(PagesBuilder, pagesStorage, "ESM");
