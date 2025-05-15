/**
 * @file High-level language for a symbolic monitor --- SyMon
 * @author Masaki Waga <masakiwaga@gmail.com>
 * @license Apache2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "symon",

  conflicts: $ => [
    [$.string_constraint, $._numeric_atomic]
  ],

  rules: {
    source_file: $ => seq(
      optional(
        $.variables
      ),
      optional(
        $.initial_constraints
      ),
      repeat1($.signature),
      repeat($.let_in),
      $.expr
    ),

    type: $ => choice(
      'string',
      'number'
    ),

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

    let_in: $ => seq(
      'let',
      $.identifier,
      '=',
      $.expr,
      'in'
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
      $.time_restriction,
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
      seq($.identifier, $._string_comparator, $.string),
      seq($.string, $._string_comparator, $.identifier)
    ),

    numeric_constraint: $ => seq($._numeric_expr, $._numeric_comparator, $._numeric_expr),

    assignment: $ => seq(
      $.identifier,
      ':=',
      $._numeric_expr
    ),

    _numeric_expr: $ => prec(1, choice(
      $._numeric_atomic,
      seq('(', $._numeric_expr, ')'),
      prec.left(seq($._numeric_expr, $._numeric_operator, $._numeric_expr))
    )),

    timing_constraint: $ => choice(
      $.intervals,
      $.half_guard
    ),

    intervals: $ => choice(
      seq('[', $._numeric_expr, ',', $._numeric_expr, ']'),
      seq('(', $._numeric_expr, ',', $._numeric_expr, ')'),
      seq('[', $._numeric_expr, ',', $._numeric_expr, ')'),
      seq('(', $._numeric_expr, ',', $._numeric_expr, ']')
    ),

    half_guard: $ => seq(
      '(',
      choice(
        '>', 
        '>=',
        '=',
        '<=',
        '<'
      ),
      $._numeric_expr,
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
      '==',
      '!=',
      '<=',
      '<'
    ),

    _string_comparator: $ => choice(
      '==',
      '!='
    ),

    concat: $ => prec.left(seq(
      $.expr,
      ';',
      $.expr
    )),

    optional: $ => seq(
      $.expr,
      '?'
    ),


    kleene_star: $ => seq(
      $.expr,
      '*'
    ),

    kleene_plus: $ => seq(
      $.expr,
      '+'
    ),

    conjunction: $ => prec.left(seq(
      $.expr,
      '&&',
      $.expr
    )),

    disjunction: $ => prec.left(seq(
      $.expr,
      '||',
      $.expr
    )),

    within: $ => seq(
      'within',
      $.timing_constraint,
      '{',
      $.expr,
      '}'
    ),

    time_restriction: $ => seq(
      $.expr,
      '%',
      $.timing_constraint
    ),

    paren_expr: $ => seq(
      '(',
      $.expr,
      ')'
    ),

    comment: $ => /#.*/,

    line_comment: $ => prec.right(choice(
      $.comment
    ))
  },

  extras: $ => [/\s/, $.line_comment]
});
