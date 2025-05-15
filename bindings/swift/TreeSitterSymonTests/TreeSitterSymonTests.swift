import XCTest
import SwiftTreeSitter
import TreeSitterSymon

final class TreeSitterSymonTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_symon())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading SyMon grammar")
    }
}
