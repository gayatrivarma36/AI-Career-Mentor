import os
import sys
import unittest

sys.path.append(os.path.dirname(__file__))
import main


class BackendRoutesTest(unittest.TestCase):
    def setUp(self):
        self.client = main.app.test_client()

    def test_home_page_renders(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'AI Career Mentor Dashboard', response.data)

    def test_roadmap_requires_fields(self):
        response = self.client.post('/roadmap', json={'skills': 'Python'})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Missing', response.data)

    def test_courses_route_returns_result(self):
        response = self.client.post('/courses', json={'skill': 'Machine Learning'})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'result', response.data)


if __name__ == '__main__':
    unittest.main()
