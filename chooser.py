import random

# List of declaration and input/output keywords
declaration_keywords = ['let', 'dim', 'data', 'const', 'var']
input_output_keywords = ['inputtab', 'list', 'input', 'print', 'spc']

# Function to simulate a competition and randomly choose a winner
def competition(declaration, output_input):
    return random.choice([declaration, output_input])

# Function to run the competition until there are 2 winners
def run_competitions():
    declaration_winner = None
    input_output_winner = None
    
    # Run until both winners are found
    while not declaration_winner or not input_output_winner:
        declaration_keyword = random.choice(declaration_keywords)
        input_output_keyword = random.choice(input_output_keywords)
        
        print(f"Competition: {declaration_keyword} vs {input_output_keyword}")
        winner = competition(declaration_keyword, input_output_keyword)
        
        if winner == declaration_keyword and not declaration_winner:
            declaration_winner = declaration_keyword
            print(f"Winner (Declaration): {declaration_keyword}")
        elif winner == input_output_keyword and not input_output_winner:
            input_output_winner = input_output_keyword
            print(f"Winner (Input/Output): {input_output_keyword}")
        
    return declaration_winner, input_output_winner

# Running the competition
declaration_winner, input_output_winner = run_competitions()

# Output the final winners
print("\nFinal Results:")
print(f"Declaration Winner: {declaration_winner}")
print(f"Input/Output Winner: {input_output_winner}")
