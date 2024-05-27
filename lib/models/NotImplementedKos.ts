import {
  Concept,
  ConceptScheme,
  Identifier,
  Kos,
} from "@kos-kit/client/models";

export class NotImplementedKos implements Kos {
  conceptByIdentifier(_identifier: Identifier): Promise<Concept> {
    throw new Error("method not implemented");
  }

  concepts(): AsyncGenerator<Concept, any, unknown> {
    throw new Error("method not implemented");
  }

  conceptsPage(_kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("method not implemented");
  }

  conceptsCount(): Promise<number> {
    throw new Error("method not implemented");
  }

  conceptSchemeByIdentifier(_identifier: Identifier): Promise<ConceptScheme> {
    throw new Error("method not implemented");
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("method not implemented");
  }

  languageTags(): Promise<readonly string[]> {
    throw new Error("method not implemented");
  }
}
