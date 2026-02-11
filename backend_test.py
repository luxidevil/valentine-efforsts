import requests
import sys
import json
import base64
from datetime import datetime

class ValentineCardAPITester:
    def __init__(self, base_url="https://heart-gallery-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_card_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error response: {error_data}")
                except:
                    print(f"Error text: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def create_sample_base64_image(self):
        """Create a small sample base64 image for testing"""
        # Simple 1x1 pixel red PNG in base64
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_create_card(self):
        """Test creating a Valentine's card"""
        sample_image = self.create_sample_base64_image()
        
        card_data = {
            "girlfriend_name": "Emma",
            "sender_name": "John",
            "description": "Emma is the most amazing person I know. She has the most beautiful smile and makes me laugh every day. I love how she cares for everyone around her and her passion for art.",
            "photos": [sample_image, sample_image]
        }
        
        success, response = self.run_test(
            "Create Valentine Card",
            "POST",
            "cards",
            200,
            data=card_data
        )
        
        if success and 'id' in response:
            self.created_card_id = response['id']
            print(f"✅ Card created with ID: {self.created_card_id}")
            
            # Validate response structure
            required_fields = ['id', 'girlfriend_name', 'sender_name', 'description', 'photos', 'poem', 'love_notes', 'scratch_message', 'created_at']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            
            # Validate AI-generated content
            if not response.get('poem'):
                print(f"❌ No poem generated")
                return False
            
            if not response.get('love_notes') or len(response['love_notes']) != 5:
                print(f"❌ Invalid love_notes: expected 5, got {len(response.get('love_notes', []))}")
                return False
                
            if not response.get('scratch_message'):
                print(f"❌ No scratch message generated")
                return False
                
            print(f"✅ AI content generated successfully")
            print(f"Poem: {response['poem'][:100]}...")
            print(f"Love notes count: {len(response['love_notes'])}")
            print(f"Scratch message: {response['scratch_message'][:50]}...")
            
        return success

    def test_get_card(self):
        """Test retrieving a card by ID"""
        if not self.created_card_id:
            print("❌ No card ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Valentine Card",
            "GET",
            f"cards/{self.created_card_id}",
            200
        )
        
        if success:
            # Validate that we get the same data back
            required_fields = ['id', 'girlfriend_name', 'sender_name', 'description', 'photos', 'poem', 'love_notes', 'scratch_message']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in GET response: {field}")
                    return False
            
            if response['id'] != self.created_card_id:
                print(f"❌ Card ID mismatch: expected {self.created_card_id}, got {response['id']}")
                return False
                
            print(f"✅ Card retrieved successfully with all fields")
        
        return success

    def test_get_nonexistent_card(self):
        """Test retrieving a non-existent card"""
        success, response = self.run_test(
            "Get Non-existent Card",
            "GET",
            "cards/nonexistent-id",
            404
        )
        return success

def main():
    print("🚀 Starting Valentine Card API Tests")
    print("=" * 50)
    
    tester = ValentineCardAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_create_card,
        tester.test_get_card,
        tester.test_get_nonexistent_card
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            tester.tests_run += 1
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())