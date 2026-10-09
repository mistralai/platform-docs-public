import { describe, expect, it } from "vitest";
import { getOGPropsFromSearchParams } from "@/components/og/helpers";

const defaults = {
  title: "Generic",
  description: "Generic Description",
  eyebraw: "Mistral AI",
  image: "/ogs/docs.png",
  titleFontSize: 80,
};

describe("getOGPropsFromSearchParams titleFontSize", () => {
  it("keeps a valid font size", () => {
    const props = getOGPropsFromSearchParams(
      new URLSearchParams("titleFontSize=56"),
      defaults
    );
    expect(props.titleFontSize).toBe(56);
  });

  it.each(["abc", "0", "-10", ""])(
    "falls back to the default for %j",
    value => {
      const props = getOGPropsFromSearchParams(
        new URLSearchParams({ titleFontSize: value }),
        defaults
      );
      expect(props.titleFontSize).toBe(80);
    }
  );
});
