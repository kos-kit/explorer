import { skos } from "@/lib/vocabularies";
import { NamedNode } from "@rdfjs/types";

export class NoteProperty {
  static readonly CHANGE_NOTE = new NoteProperty(
    skos.changeNote,
    "Change note",
  );

  static readonly DEFINITION = new NoteProperty(skos.definition, "Definition");

  static readonly EDITORIAL_NOTE = new NoteProperty(
    skos.editorialNote,
    "Editorial note",
  );

  static readonly EXAMPLE = new NoteProperty(skos.example, "Example");

  static readonly HISTORY_NOTE = new NoteProperty(
    skos.historyNote,
    "History note",
  );

  static readonly NOTE = new NoteProperty(skos.note, "Note");

  static readonly SCOPE_NOTE = new NoteProperty(skos.scopeNote, "Scope note");

  readonly name: string;

  private constructor(
    readonly identifier: NamedNode,
    readonly label: string,
  ) {
    this.name = identifier.value.substring(skos[""].value.length);
  }
}
