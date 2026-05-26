; Indentation rules for SyMon.

; Comments should keep ordinary comment indentation behavior.
(line_comment) @indent.auto

; Block-like constructs: indent their contents by one shiftwidth.
[
  (variables)
  (initial_constraints)
  (signature)
  (def_expr)
  (optional_block)
  (zero_or_more)
  (one_or_more)
  (one_of)
  (all_of)
  (within)
  (ignore)
] @indent.begin

; Parenthesized / delimited constructs that symon-mode also indents.
[
  (paren_expr)
  (atomic)
  (intervals)
  (half_guard)
] @indent.begin

; Postfix optional expressions exist in the grammar and are also mentioned
; in symon-mode.el. This rarely matters unless the expression spans lines.
(optional) @indent.begin

; Closing braces dedent to the indentation of the block opener.
"}" @indent.branch

; symon-mode explicitly dedents closing ")" for half_guard and intervals.
(intervals ")" @indent.branch)
(half_guard ")" @indent.branch)
