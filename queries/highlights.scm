;; 1. Comments
((line_comment) @comment)

;; 2. Strings
((string) @string)

;; 3. Types
([
 "string" "number" "param"
 ] @type)

;; 4. Numeric literals
((number) @constant)

;; 5. Keywords
([
  "var" "init" "signature" "expr" "within" "optional" "zero_or_more" "one_or_more" "one_of" "or" "all_of" "and" "ignore"
 ] @keyword)

;; 6. Operators
([
 "==" "!="
 "<" "<=" "=" "<>" ">" ">="
 "%" "*" "+" "-" "?"
 ":=" "|"
 "||" "&&"
 ] @operator)

;; 7. Brackets
([
 "(" ")" "{" "}"
 ] @punctuation.bracket)

;; 8. Delimiters
([
 "," ";" ":"
 ] @punctuation.delimiter)

;; 9. All other identifiers
((identifier) @variable.parameter)
