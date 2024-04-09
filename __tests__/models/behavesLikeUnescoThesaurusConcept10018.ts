import { Concept } from "@/lib/models/Concept";
import { behavesLikeConcept } from "./behavesLikeConcept";
import { DataFactory } from "n3";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { NoteProperty } from "@/lib/models/NoteProperty";

export const behavesLikeUnescoThesaurusConcept10018 = (
  lazyConcept: () => Promise<Concept>,
) => {
  it("should be in the single concept scheme", async () => {
    const concept = await lazyConcept();
    const inSchemes = await concept.inSchemes();
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have a modified date", async () => {
    const concept = await lazyConcept();
    expect((await concept.modified())!.value).toStrictEqual(
      "2019-12-15T13:44:31Z",
    );
  });

  it("should have multiple alt labels", async () => {
    const concept = await lazyConcept();

    const arAltLabels = await concept.altLabels({ languageTag: "ar" });
    expect(arAltLabels).toHaveLength(1);
    expect(arAltLabels[0].literalForm.value).toStrictEqual(
      "تقييم التأثير على البيئة",
    );

    const esAltLabels = await concept.altLabels({ languageTag: "es" });
    expect(esAltLabels).toHaveLength(1);
    expect(esAltLabels[0].literalForm.value).toStrictEqual(
      "Valoración del impacto ambiental",
    );
  });

  it("should be in the single concept scheme", async () => {
    const concept = await lazyConcept();
    const inSchemes = await concept.inSchemes();
    expect(inSchemes).toHaveLength(1);
    expect(
      inSchemes[0].identifier.equals(
        DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
      ),
    );
  });

  it("should have multiple prefLabels", async () => {
    const concept = await lazyConcept();

    const enPrefLabels = await concept.prefLabels({ languageTag: "en" });
    expect(enPrefLabels).toHaveLength(1);
    expect(enPrefLabels[0].literalForm.value).toStrictEqual(
      "Environmental impact assessment",
    );

    const frPrefLabels = await concept.prefLabels({ languageTag: "fr" });
    expect(frPrefLabels).toHaveLength(1);
    expect(frPrefLabels[0].literalForm.value).toStrictEqual(
      "Évaluation de l'impact sur l'environnement",
    );
  });

  it("should have known semantic relations", async () => {
    const concept = await lazyConcept();
    for (const { semanticRelationProperty, conceptNumbers } of [
      {
        semanticRelationProperty: SemanticRelationProperty.BROADER,
        conceptNumbers: [197],
      },
      {
        semanticRelationProperty: SemanticRelationProperty.RELATED,
        conceptNumbers: [207, 3317, 7775, 6317, 4533],
      },
    ]) {
      expect(
        await concept.semanticRelationsCount(semanticRelationProperty),
      ).toStrictEqual(conceptNumbers.length);
      const semanticRelations = await concept.semanticRelations(
        semanticRelationProperty,
      );
      expect(semanticRelations).toHaveLength(conceptNumbers.length);
      for (const conceptNumber of conceptNumbers) {
        const conceptIdentifier = DataFactory.namedNode(
          `http://vocabularies.unesco.org/thesaurus/concept${conceptNumber}`,
        );
        expect(
          semanticRelations.find((semanticRelation) =>
            semanticRelation.identifier.equals(conceptIdentifier),
          ),
        ).toBeDefined();
      }
    }
  });

  it("should have multiple notes", async () => {
    const concept = await lazyConcept();

    expect(await concept.notes("en", NoteProperty.SCOPE_NOTE)).toHaveLength(1);
    expect(
      (await concept.notes("en", NoteProperty.SCOPE_NOTE))[0].value,
    ).toStrictEqual(
      "An activity designed to identify, predict, interpret and communicate information concerning the environmental consequences of policies, projects etc.",
    );

    expect(await concept.notes("fr", NoteProperty.SCOPE_NOTE)).toHaveLength(1);
    expect(
      (await concept.notes("fr", NoteProperty.SCOPE_NOTE))[0].value,
    ).toStrictEqual(
      "Activité destinée à identifier, prévoir, interpréter et communiquer l'information ayant trait aux conséquences de politiques, de projets, etc., sur l'environnement.",
    );
  });

  behavesLikeConcept(lazyConcept);
};
