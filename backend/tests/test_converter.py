import unittest
import io
from PIL import Image
from converter import process_single_image, generate_pdf_from_images
from utils import sanitize_pdf_filename, allowed_file

class TestConverterLogic(unittest.TestCase):

    def setUp(self):
        # Create a test image in memory
        self.img = Image.new('RGBA', (200, 300), color=(255, 0, 0, 128))

    def test_sanitize_filename(self):
        self.assertEqual(sanitize_pdf_filename("my test.pdf"), "my_test.pdf")
        self.assertEqual(sanitize_pdf_filename("document"), "document.pdf")
        self.assertEqual(sanitize_pdf_filename(""), "converted.pdf")

    def test_allowed_file(self):
        self.assertTrue(allowed_file("test.jpg"))
        self.assertTrue(allowed_file("test.png"))
        self.assertTrue(allowed_file("TEST.WEBP"))
        self.assertFalse(allowed_file("script.py"))
        self.assertFalse(allowed_file("test.exe"))

    def test_process_single_image_a4(self):
        img_bytes = process_single_image(
            img=self.img,
            rotation=90,
            page_size_name='A4',
            orientation='portrait',
            margin_name='small',
            quality_preset='high'
        )
        self.assertIsInstance(img_bytes, bytes)
        self.assertGreater(len(img_bytes), 0)

    def test_pdf_generation_and_encryption(self):
        img_bytes1 = process_single_image(self.img, rotation=0, page_size_name='A4')
        img_bytes2 = process_single_image(self.img, rotation=180, page_size_name='Letter')
        
        pdf_bytes = generate_pdf_from_images(
            image_bytes_list=[img_bytes1, img_bytes2],
            password="secretpassword",
            add_page_numbers=True
        )
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertGreater(len(pdf_bytes), 100)
        # PDF magic header check
        self.assertTrue(pdf_bytes.startswith(b'%PDF'))

if __name__ == '__main__':
    unittest.main()
