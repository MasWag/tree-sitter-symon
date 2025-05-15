package tree_sitter_symon_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_symon "github.com/maswag/symon/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_symon.Language())
	if language == nil {
		t.Errorf("Error loading SyMon grammar")
	}
}
