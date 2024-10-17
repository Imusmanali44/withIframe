import pyautogui
import time
import random
import pygetwindow as gw

# Get the specific windows for VS Code and Chrome
def get_windows():
    vscode_window = gw.getWindowsWithTitle('Visual Studio Code')[0]  # Assuming "Visual Studio Code" in title
    chrome_window = gw.getWindowsWithTitle('Google Chrome')[0]  # Assuming "Google Chrome" in title
    return vscode_window, chrome_window

# Typing with random speed, mistakes, pauses, and backspace corrections (only in VS Code)
def human_typing(text):
    for char in text:
        if random.random() < 0.05:  # 5% chance of making a typing mistake
            pyautogui.write(random.choice('abcdefghijklmnopqrstuvwxyz'))  # Mistyped character
            time.sleep(random.uniform(0.05, 0.3))  # Small pause after mistake
            pyautogui.press('backspace')  # Backspace to correct the mistake

        typing_speed = random.uniform(0.1, 0.3)  # Random typing delay to mimic natural variation
        pyautogui.write(char)
        time.sleep(typing_speed)
        
        if random.random() < 0.1:  # 10% chance to pause while typing to mimic thinking
            time.sleep(random.uniform(0.3, 1))

# Switch to Chrome (only for scrolling, moving mouse, clicking)
def switch_to_chrome(chrome_window):
    chrome_window.activate()  # Activate Chrome window
    time.sleep(random.uniform(0.5, 1.5))  # Adding delay after switching to Chrome

# Switch back to VS Code (for typing)
def switch_back_to_vscode(vscode_window):
    vscode_window.activate()  # Activate VS Code window
    time.sleep(random.uniform(0.5, 1.5))  # Adding delay after switching to VS Code

# Random pauses for staring at screen
def random_pause(min_seconds, max_seconds):
    pause_duration = random.uniform(min_seconds, max_seconds)
    time.sleep(pause_duration)

# Simulate random mouse movement on Chrome with clicks, limited to a specific region
def random_mouse_movement_on_chrome():
    # Coordinates of the clickable area inside the red circle
    region_top_left = (300, 200)
    region_bottom_right = (1600, 900)
    
    for _ in range(random.randint(3, 7)):  # Random number of mouse moves
        x = random.randint(region_top_left[0], region_bottom_right[0])
        y = random.randint(region_top_left[1], region_bottom_right[1])
        pyautogui.moveTo(x, y, duration=random.uniform(0.2, 1.5))  # Human-like random movements
        
        # Random delay before clicking
        time.sleep(random.uniform(0.5, 1.5))
        
        if random.random() < 0.3:  # 30% chance of a mouse click
            pyautogui.click()
            # Random delay after click
            time.sleep(random.uniform(0.2, 1.0))
        
        time.sleep(random.uniform(0.5, 2))  # Random pause between mouse moves

# Simulate random scrolling on Chrome
def random_scrolling_on_chrome():
    for _ in range(random.randint(1, 5)):  # Random number of scrolls
        scroll_amount = random.randint(-500, 500)
        pyautogui.scroll(scroll_amount)
        # Random delay after scroll to mimic browsing behavior
        time.sleep(random.uniform(1, 3))

# Simulate random mouse movement on VS Code without clicking
def random_mouse_movement_on_vscode():
    screen_width, screen_height = pyautogui.size()
    for _ in range(random.randint(3, 7)):  # Random number of mouse moves
        x = random.randint(0, screen_width)
        y = random.randint(0, screen_height)
        pyautogui.moveTo(x, y, duration=random.uniform(0.2, 1.5))  # Human-like random movements
        
        # Random pause between mouse movements to mimic human behavior
        time.sleep(random.uniform(0.5, 2))

# Main simulation function
def simulate_working_environment(file_path):
    vscode_window, chrome_window = get_windows()  # Get VS Code and Chrome windows

    with open(file_path, 'r') as file:
        code_lines = file.readlines()

    # Start typing in VS Code with random pauses, tab switching, and mouse movements
    for line in code_lines:
        # Always switch back to VS Code before typing
        switch_back_to_vscode(vscode_window)
        human_typing(line)
        pyautogui.press('enter')
        pyautogui.hotkey('shift', 'alt', 'f')

        # Randomly switch to Chrome window
        if random.random() < 0.8:  # 80% chance to switch to Chrome
            switch_to_chrome(chrome_window)
            random_mouse_movement_on_chrome()
            random_scrolling_on_chrome()
            random_pause(1, 5)  # Pause for 1 to 5 seconds

            # Switch back to VS Code after interacting with Chrome
            switch_back_to_vscode(vscode_window)

        # Random pauses in VS Code to mimic thinking or waiting
        random_pause(5, 10)  # Pause for 5 to 10 seconds

        # Occasional mouse movements in VS Code without clicking
        if random.random() < 0.2:  # 20% chance for mouse movements in VS Code
            random_mouse_movement_on_vscode()

# Wait before starting so you can focus on VS Code
print("You have 5 seconds to focus on VS Code.")
time.sleep(10)

# Simulate the working environment
simulate_working_environment('threejsScripts/Floor.js')
