;; 1. Comments
(comment) @comment

;; 2. Strings
(string) @string

;; 3. Types
[
 "string" "number" "param"
] @type

;; 4. Numeric literals
(number) @number

;; 5. Keywords
[
  "var" "init" "signature" "let" "in" "within"
] @keyword

;; 6. All other identifiers
(identifier) @variable
