import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

PORT = 8005

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(f"http://localhost:{PORT}")
        await page.evaluate("localStorage.setItem('bibbidiba_tutorial_done', 'true')")

        # Click start
        await page.wait_for_selector('text="Start New Game"')
        await page.click('text="Start New Game"')

        # wait a bit for transition
        await asyncio.sleep(2)

        await page.evaluate("""
            window.executeRoll(true);
        """)

        await asyncio.sleep(0.5)

        # Attack!
        await page.evaluate("window.fireAttack()")

        # The animation starts, wait a bit and take a screenshot
        await asyncio.sleep(0.3)
        os.makedirs("verification/screenshots", exist_ok=True)
        await page.screenshot(path="verification/screenshots/verification_attack1.png")

        await asyncio.sleep(0.2)
        await page.screenshot(path="verification/screenshots/verification_attack2.png")

        await browser.close()

if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    asyncio.run(run())
