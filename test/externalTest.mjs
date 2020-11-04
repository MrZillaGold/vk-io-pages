import { PagesBuilder, pagesStorage } from "../src/PageBuilder.mjs";
import { test } from "./tests.mjs";

test(PagesBuilder, pagesStorage, "ESM");
