/**
 * @file High-level language for a symbolic monitor --- SyMon
 * @author Masaki Waga <masakiwaga@gmail.com>
 * @license Apache2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "symon",

  rules: {
    source_file: $ => seq(
      optional(
        $.variables
      ),
      optional(
        $.initial_constraints
      ),
      repeat1($.signature),
      repeat($.def_expr),
      $.expr
    ),

    /**
     * Variable declarations
     *
     * This block is used to define timing parameters, string parameters/variables, and numeric parameters/variables.
     */
    variables: $ => seq(
      'var',
      '{',
      repeat(choice(
        $.parameter_definition,
        $.string_definition,
        $.number_definition
      )),
      '}'
    ),

    parameter_definition: $ => seq(
      $.identifier,
      ':',
      'param',
      ';'
    ),

    initial_constraints: $ => seq(
      'init',
      '{',
      $.constraint_list,
      '}'
    ),

    /**
     * Signature declaration
     */
    signature: $ => seq(
      'signature',
      $.identifier,
      '{',
      repeat($.string_definition),
      repeat($.number_definition),
      '}'
    ),

    string_definition: $ => seq(
      $.identifier,
      ':',
      'string',
      ';'
    ),

    number_definition: $ => seq(
      $.identifier,
      ':',
      'number',
      ';'
    ),

    def_expr: $ => seq(
      'expr',
      $.identifier,
      '{',
      $.expr,
      '}'
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string: $ => seq(
      '"',
      /[^"]*/,
      '"'
    ),

    expr: $ => choice(
      $.identifier,
      $.atomic,
      $.concat,
      $.conjunction,
      $.disjunction,
      $.optional,
      $.kleene_star,
      $.kleene_plus,
      $.within,
      $.optional_block,
      $.zero_or_more,
      $.one_or_more,
      $.one_of,
      $.all_of,
      $.time_restriction,
      $.ignore,
      $.paren_expr
    ),

    atomic: $ => seq(
      $.identifier,
      '(',
      optional($.arg_list),
      optional($.guard_block),
      ')'
    ),

    arg_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier))
    ),

    guard_block: $ => seq(
      '|',
      optional($.constraint_list),
      optional(seq(
        '|', 
        optional($.assignment_list)
      ))
    ),

    constraint_list: $ => prec.left(seq(
      $.constraint,
      repeat(
        seq('&&', $.constraint_list)
      )
    )),

    assignment_list: $ => prec.left(seq(
      $.assignment,
      repeat(seq(';', $.assignment))
    )),

    constraint: $ => choice(
      $.string_constraint,
      $.numeric_constraint
    ),

    string_constraint: $ => choice(
      seq($.identifier, $._string_comparator, $.identifier),
      seq($.identifier, $._string_comparator, $.string),
      seq($.string, $._string_comparator, $.identifier),
      seq($.string, $._string_comparator, $.string)
    ),

    numeric_constraint: $ => seq($.numeric_expr, $._numeric_comparator, $.numeric_expr),

    assignment: $ => seq(
      $.identifier,
      ':=',
      choice($.string, $.numeric_expr)
    ),

    numeric_expr: $ => prec(1, choice(
      $._numeric_atomic,
      seq('(', $.numeric_expr, ')'),
      prec.left(seq($.numeric_expr, $._numeric_operator, $.numeric_expr))
    )),

    timing_constraint: $ => choice(
      $.intervals,
      $.half_guard
    ),

    intervals: $ => choice(
      seq('[', $.numeric_expr, ',', $.numeric_expr, ']'),
      seq('(', $.numeric_expr, ',', $.numeric_expr, ')'),
      seq('[', $.numeric_expr, ',', $.numeric_expr, ')'),
      seq('(', $.numeric_expr, ',', $.numeric_expr, ']')
    ),

    half_guard: $ => seq(
      '(',
      $._numeric_comparator,
      $.numeric_expr,
      ')'
    ),

    _numeric_atomic: $ => choice(
      $.identifier,
      $.number,
    ),

    number: $ => /-?(?:0|[1-9][0-9]*)(\.[0-9]+)?/,

    _numeric_operator: $ => choice(
      '+',
      '-'
    ),

    _numeric_comparator: $ => choice(
      '>',
      '>=',
      '=',
      '<>',
      '<=',
      '<'
    ),

    _string_comparator: $ => choice(
      '==',
      '!='
    ),

    concat: $ => prec(1, prec.left(seq(
      $.expr,
      ';',
      $.expr
    ))),

    optional: $ => prec(5, seq(
      $.expr,
      '?'
    )),


    kleene_star: $ => prec(5, seq(
      $.expr,
      '*'
    )),

    kleene_plus: $ => prec(5, seq(
      $.expr,
      '+'
    )),

    conjunction: $ => prec.left(3, seq(
      $.expr,
      '&&',
      $.expr
    )),

    disjunction: $ => prec.left(2, seq(
      $.expr,
      '||',
      $.expr
    )),

    optional_block: $ => seq(
      'optional',
      '{',
      $.expr,
      '}'
    ),

    zero_or_more: $ => seq(
      'zero_or_more',
      '{',
      $.expr,
      '}'
    ),

    one_or_more: $ => seq(
      'one_or_more',
      '{',
      $.expr,
      '}'
    ),

    one_of: $ => seq(
      'one_of',
      '{',
      $.expr,
      '}',
      repeat1(seq('or', '{', $.expr, '}'))
    ),

    all_of: $ => seq(
      'all_of',
      '{',
      $.expr,
      '}',
      repeat1(seq('and', '{', $.expr, '}'))
    ),

    within: $ => seq(
      'within',
      $.timing_constraint,
      '{',
      $.expr,
      '}'
    ),

    time_restriction: $ => prec.right(5, seq($.expr, '%', $.timing_constraint)),

    ignore: $ => seq(
      'ignore',
      $.identifier_list,
      '{',
      $.expr,
      '}'
    ),

    identifier_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier))
    ),

    paren_expr: $ => seq(
      '(',
      $.expr,
      ')'
    ),

    line_comment: $ => /#.*/
  },

  extras: $ => [/\s/, $.line_comment]
});
