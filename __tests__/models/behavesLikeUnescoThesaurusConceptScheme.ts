import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { behavesLikeConceptScheme } from "./behavesLikeConceptScheme";

export const behavesLikeUnescoThesaurusConceptScheme = (
  lazyConceptScheme: () => Promise<ConceptScheme>,
) => {
  it("should have a modified date", async () => {
    const conceptScheme = await lazyConceptScheme();
    expect((await conceptScheme.modified())!.value).toStrictEqual(
      "2024-03-25T14:24:28.295+01:00",
    );
  });

  it("should have a license", async () => {
    const conceptScheme = await lazyConceptScheme();
    const license = await conceptScheme.license("en");
    expect(license).toBeDefined();
    expect(license!.termType).toStrictEqual("NamedNode");
    expect(license!.value).toStrictEqual(
      "http://creativecommons.org/licenses/by-sa/3.0/igo/",
    );
  });

  it("should have multiple prefLabels", async () => {
    const conceptScheme = await lazyConceptScheme();
    expect(
      (await conceptScheme.prefLabel("en"))!.literalForm.value,
    ).toStrictEqual("UNESCO Thesaurus");
    expect(
      (await conceptScheme.prefLabel("fr"))!.literalForm.value,
    ).toStrictEqual("Thésaurus de l'UNESCO");
  });

  it("should have rights", async () => {
    const conceptScheme = await lazyConceptScheme();
    const rights = await conceptScheme.rights("en");
    expect(rights).toBeDefined();
    expect(rights!.value).toStrictEqual("CC-BY-SA");
  });

  it("should have a rights holder", async () => {
    const conceptScheme = await lazyConceptScheme();
    const rightsHolder = await conceptScheme.rightsHolder("en");
    expect(rightsHolder).toBeDefined();
    expect(rightsHolder!.value).toStrictEqual("UNESCO");
  });

  behavesLikeConceptScheme(lazyConceptScheme);
};
