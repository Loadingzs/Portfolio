import unittest
from html.parser import HTMLParser

from app import app


class DownloadLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("download") == "Maykon_Curriculo.pdf":
            self.links.append(attrs)


class ResumeDownloadTest(unittest.TestCase):
    def test_resume_link_serves_pdf_without_javascript(self):
        with app.test_client() as client:
            page = client.get("/")
            self.assertEqual(page.status_code, 200)
            parser = DownloadLinks()
            parser.feed(page.get_data(as_text=True))
            self.assertEqual(len(parser.links), 1)
            self.assertEqual(parser.links[0]["href"], "/static/Curriculo.pdf")
            with client.get(parser.links[0]["href"]) as pdf:
                self.assertEqual(pdf.status_code, 200)
                self.assertEqual(pdf.mimetype, "application/pdf")
                self.assertTrue(pdf.data.startswith(b"%PDF-"))

    def test_resume_link_respects_application_prefix(self):
        with app.test_client() as client:
            page = client.get("/", environ_overrides={"SCRIPT_NAME": "/portfolio"})
            self.assertEqual(page.status_code, 200)
            parser = DownloadLinks()
            parser.feed(page.get_data(as_text=True))
            self.assertEqual(len(parser.links), 1)
            self.assertEqual(parser.links[0]["href"], "/portfolio/static/Curriculo.pdf")


if __name__ == "__main__":
    unittest.main()
