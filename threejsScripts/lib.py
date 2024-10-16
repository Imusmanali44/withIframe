import pyautogui
import time
import random

# Typing with random speed, mistakes, and backspace corrections
def human_typing(text):
    for char in text:
        if random.random() < 0.05:  # 5% chance of making a typing mistake
            pyautogui.write(random.choice('abcdefghijklmnopqrstuvwxyz'))  # Mistyped character
            time.sleep(random.uniform(0.05, 0.2))  # Small pause after mistake
            pyautogui.press('backspace')  # Backspace to correct the mistake

        typing_speed = random.uniform(0.05, 0.2)  # Random typing delay
        pyautogui.write(char)
        time.sleep(typing_speed)

# Switch between Chrome tabs (window 1 and window 2) and VS Code
def switch_to_chrome(window_number):
      pyautogui.hotkey('alt', 'tab')
      if window_number==2:

        pyautogui.hotkey('alt', 'tab')
        time.sleep(0.3)
        pyautogui.hotkey('alt', 'tab')

      # Switch windows
        time.sleep(0.5)
  

# Randomly switch back to VS Code
def switch_back_to_vscode():
    pyautogui.hotkey('alt', 'tab')  # Switch back to VS Code
    time.sleep(0.5)

# Random pauses for staring at screen
def random_pause(min_seconds, max_seconds):
    pause_duration = random.uniform(min_seconds, max_seconds)
    time.sleep(pause_duration)

# Simulate random mouse movement and clicks on Chrome tabs
def random_mouse_movement():
    screen_width, screen_height = pyautogui.size()
    for _ in range(random.randint(3, 7)):  # Random number of mouse moves
        x = random.randint(0, screen_width)
        y = random.randint(0, screen_height)
        pyautogui.moveTo(x, y, duration=random.uniform(0.2, 1.0))  # Human-like random movements
        if random.random() < 0.3:  # 30% chance of a mouse click
            pyautogui.click()
        time.sleep(random.uniform(0.5, 2))

# Simulate scrolling in Chrome
def random_scrolling():
    for _ in range(random.randint(1, 5)):  # Random number of scrolls
        scroll_amount = random.randint(-500, 500)
        pyautogui.scroll(scroll_amount)
        time.sleep(random.uniform(1, 3))  # Random pause between scrolls

# Simulate idle behavior (random moments of no action)
def idle_behavior():
    idle_duration = random.uniform(60, 180)  # 1 to 3 minutes idle time
    print(f"Idling for {int(idle_duration)} seconds.")
    time.sleep(idle_duration)

# Main simulation function
def simulate_working_environment(file_path):
    with open(file_path, 'r') as file:
        code_lines = file.readlines()

    # Start typing in VS Code with random pauses, tab switching, and mouse movements
    for line in code_lines:
        # Randomly decide to idle before typing
        if random.random() < 0.2:  # 20% chance of idling
            idle_behavior()

        # Type the line with human-like typing
        human_typing(line)
        pyautogui.press('enter')

        # Randomly switch to Chrome window 1 or window 2
        if random.random() < 0.3:  # 30% chance to switch tabs
            chrome_window = random.choice([1, 2])
            switch_to_chrome(chrome_window)
            random_mouse_movement()
            random_scrolling()
            random_pause(30, 120)  # Pause for 30 seconds to 2 minutes

            # Switch back to VS Code
            switch_back_to_vscode()

        # Random pauses in VS Code to mimic thinking or waiting
        random_pause(5, 10)  # Pause for 5 to 10 seconds

        # Occasional mouse movements in VS Code without clicking
        if random.random() < 0.35:  # 20% chance for mouse movements in VS Code
            random_mouse_movement()

# Wait before starting so you can focus on VS Code
print("You have 5 seconds to focus on VS Code.")
time.sleep(5)

# Simulate the working environment
simulate_working_environment('threejsScripts/Floor.js')
