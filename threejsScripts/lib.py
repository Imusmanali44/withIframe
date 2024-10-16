import pyautogui
import time
import random

# Typing with random speed, mistakes, pauses, and corrections
def human_typing(text):
    for char in text:
        if random.random() < 0.05:  # 5% chance of making a typing mistake
            pyautogui.write(random.choice('abcdefghijklmnopqrstuvwxyz'))  # Mistyped character
            time.sleep(random.uniform(0.2, 0.4))  # Pause after mistake
            pyautogui.press('backspace')  # Correct the mistake

        typing_speed = random.uniform(0.1, 0.5)  # Slow random typing speed
        pyautogui.write(char)
        if random.random() < 0.1:  # 10% chance of a short pause
            time.sleep(random.uniform(1, 3))  # Pause for 1 to 3 seconds
        time.sleep(typing_speed)

# Switch randomly between the 4 windows
def switch_to_window(window_number):
    # Switch windows (Alt+Tab) based on the given window_number
    for _ in range(window_number):
        pyautogui.hotkey('alt', 'tab')
        time.sleep(0.5)  # Smooth transition between windows

# Switch back to VS Code
def switch_back_to_vscode():
    pyautogui.hotkey('alt', 'tab')  # Switch back to VS Code
    time.sleep(0.5)

# Random pauses for "staring at the screen"
def random_pause(min_seconds, max_seconds):
    pause_duration = random.uniform(min_seconds, max_seconds)
    print(f"Pausing for {int(pause_duration)} seconds.")
    time.sleep(pause_duration)

# Simulate random mouse movement and clicks in the Chrome windows
def random_mouse_movement():
    screen_width, screen_height = pyautogui.size()
    for _ in range(random.randint(2, 5)):  # Random number of mouse movements
        x = random.randint(0, screen_width)
        y = random.randint(0, screen_height)
        pyautogui.moveTo(x, y, duration=random.uniform(0.5, 1.5))  # Human-like movements
        if random.random() < 0.3:  # 30% chance of a mouse click
            pyautogui.click()
        time.sleep(random.uniform(1, 3))

# Simulate random scrolling in Chrome
def random_scrolling():
    for _ in range(random.randint(1, 3)):  # Random scroll actions
        scroll_amount = random.randint(-400, 400)
        pyautogui.scroll(scroll_amount)
        time.sleep(random.uniform(1, 3))  # Random pauses between scrolls

# Simulate idle behavior (doing nothing for a while)
def idle_behavior():
    idle_duration = random.uniform(30, 120)  # 30 seconds to 2 minutes
    print(f"Idling for {int(idle_duration)} seconds.")
    time.sleep(idle_duration)

# Main function to simulate working environment with 4 windows
def simulate_working_environment(file_path):
    with open(file_path, 'r') as file:
        code_lines = file.readlines()

    # Start typing in VS Code with random pauses, window switching, and mouse movements
    for line in code_lines:
        # Random idle behavior before typing
        if random.random() < 0.2:  # 20% chance to idle before typing each line
            idle_behavior()

        # Simulate typing the line with human-like random pauses
        human_typing(line)
        pyautogui.press('enter')

        # Randomly switch to one of the 3 Chrome windows
        if random.random() < 0.3:  # 30% chance to switch windows
            chrome_window = random.randint(1, 3)  # Choose one of the 3 Chrome windows
            switch_to_window(chrome_window)
            random_mouse_movement()  # Move the mouse randomly in the window
            random_scrolling()  # Simulate scrolling in the Chrome window
            random_pause(30, 200)  # Pause for 30 seconds to 2 minutes

            # Switch back to VS Code to continue typing
            switch_back_to_vscode()

        # Occasional random pauses in VS Code to mimic "thinking"
        random_pause(3, 7)  # Pause for 3 to 7 seconds

        # Occasional random mouse movement in VS Code
        if random.random() < 0.2:  # 20% chance for mouse movements in VS Code
            random_mouse_movement()

# Initial wait before starting the typing simulation
print("You have 5 seconds to focus on VS Code.")
time.sleep(5)

# Simulate the working environment



# Simulate the working environment
simulate_working_environment('threejsScripts/Floor.js')
