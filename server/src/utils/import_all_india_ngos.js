import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { NGO } from '../models/NGO.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Comprehensive coordinate lookup [lng, lat] for every district/area in India
const DISTRICT_COORDINATES = {
  // Andhra Pradesh
  'Visakhapatnam': [83.2185, 17.6868],
  'Vijayawada': [80.6480, 16.5062],
  'Guntur': [80.4365, 16.3067],
  'Tirupati': [79.4192, 13.6288],
  'Kurnool': [78.0373, 15.8281],
  'Nellore': [79.9865, 14.4426],
  'Anantapur': [77.6006, 14.6819],
  'Rajahmundry': [81.8040, 17.0005],
  'Kakinada': [82.2475, 16.9891],
  'Kadapa': [78.8242, 14.4673],

  // Arunachal Pradesh
  'Itanagar': [93.6053, 27.0844],
  'Tawang': [91.8594, 27.5861],
  'Pasighat': [95.3268, 28.0668],
  'Ziro': [93.8322, 27.5947],
  'Bomdila': [92.4167, 27.2644],
  'Tezu': [96.1627, 27.9142],
  'Aalo': [94.8028, 28.1672],
  'Roing': [95.8340, 28.1408],
  'Namsai': [95.9678, 27.6685],
  'Changlang': [95.7333, 27.1333],

  // Assam
  'Guwahati': [91.7362, 26.1445],
  'Dibrugarh': [94.9120, 27.4728],
  'Jorhat': [94.2037, 26.7509],
  'Silchar': [92.7789, 24.8170],
  'Tezpur': [92.7926, 26.6528],
  'Nagaon': [92.6840, 26.3468],
  'Tinsukia': [95.3597, 27.4922],
  'Sivasagar': [94.6315, 26.9826],
  'Barpeta': [91.0059, 26.3216],
  'Dhubri': [89.9744, 26.0207],

  // Bihar
  'Patna': [85.1376, 25.5941],
  'Gaya': [85.0002, 24.7914],
  'Muzaffarpur': [85.3906, 26.1209],
  'Bhagalpur': [87.0131, 25.2425],
  'Darbhanga': [85.8918, 26.1542],
  'Purnia': [87.4753, 25.7771],
  'Nalanda': [85.4526, 25.1357],
  'Begusarai': [86.1272, 25.4182],
  'Arrah': [84.6637, 25.5560],
  'Munger': [86.4735, 25.3757],

  // Chhattisgarh
  'Raipur': [81.6296, 21.2514],
  'Bilaspur': [82.1409, 22.0797],
  'Durg': [81.2849, 21.1904],
  'Bastar': [81.9567, 19.3400],
  'Korba': [82.7108, 22.3595],
  'Rajnandgaon': [81.0345, 21.0971],
  'Raigarh': [83.3950, 21.8974],
  'Janjgir-Champa': [82.5694, 22.0152],
  'Surguja': [83.1979, 23.1202],
  'Dhamtari': [81.5492, 20.7071],

  // Goa
  'North Goa': [73.8278, 15.5494],
  'South Goa': [74.0543, 15.2736],
  'Panaji': [73.8278, 15.4909],
  'Margao': [73.9587, 15.2832],
  'Mapusa': [73.8144, 15.5937],
  'Ponda': [74.0153, 15.4026],
  'Bicholim': [73.9533, 15.5925],
  'Quepem': [74.0754, 15.2212],
  'Canacona': [74.0487, 14.9996],
  'Sanguem': [74.1554, 15.2343],

  // Gujarat
  'Ahmedabad': [72.5714, 23.0225],
  'Surat': [72.8311, 21.1702],
  'Vadodara': [73.1812, 22.3072],
  'Rajkot': [70.8022, 22.3039],
  'Bhavnagar': [72.1519, 21.7645],
  'Jamnagar': [70.0577, 22.4707],
  'Junagadh': [70.4579, 21.5222],
  'Kutch': [69.8597, 23.7337],
  'Anand': [72.9289, 22.5645],
  'Mehsana': [72.3693, 23.5880],

  // Haryana
  'Gurugram': [77.0266, 28.4595],
  'Faridabad': [77.3178, 28.4089],
  'Hisar': [75.7217, 29.1492],
  'Panipat': [76.9635, 29.3909],
  'Rohtak': [76.6066, 28.8955],
  'Karnal': [76.9897, 29.6857],
  'Ambala': [76.7794, 30.3782],
  'Sonipat': [77.0151, 28.9931],
  'Yamunanagar': [77.2674, 30.1290],
  'Rewari': [76.6173, 28.1920],

  // Himachal Pradesh
  'Shimla': [77.1734, 31.1048],
  'Kangra': [76.2709, 32.0998],
  'Mandi': [76.9320, 31.5892],
  'Kullu': [77.1095, 31.9579],
  'Solan': [77.1089, 30.9084],
  'Chamba': [76.1258, 32.5534],
  'Una': [76.2711, 31.4685],
  'Hamirpur': [76.5230, 31.6862],
  'Sirmaur': [77.2965, 30.5604],

  // Jharkhand
  'Ranchi': [85.3096, 23.3441],
  'Jamshedpur': [86.2029, 22.8046],
  'Dhanbad': [86.4304, 23.7957],
  'Bokaro': [86.1511, 23.6693],
  'Hazaribagh': [85.3647, 23.9961],
  'Deoghar': [86.6947, 24.4826],
  'Giridih': [86.3056, 24.1856],
  'Palamu': [84.0722, 24.0396],
  'Dumka': [87.2494, 24.2690],
  'Chaibasa': [85.8080, 22.5519],

  // Karnataka
  'Bengaluru Urban': [77.5946, 12.9716],
  'Mysuru': [76.6394, 12.2958],
  'Mangaluru': [74.8560, 12.9141],
  'Hubballi': [75.1240, 15.3647],
  'Belagavi': [74.4977, 15.8497],
  'Kalaburagi': [76.8343, 17.3297],
  'Shivamogga': [75.5681, 13.9299],
  'Ballari': [76.9214, 15.1394],
  'Udupi': [74.7421, 13.3409],
  'Tumakuru': [77.1010, 13.3409],

  // Kerala
  'Thiruvananthapuram': [76.9366, 8.5241],
  'Kochi': [76.2673, 9.9312],
  'Kozhikode': [75.7804, 11.2588],
  'Thrissur': [76.2144, 10.5276],
  'Kollam': [76.6033, 8.8932],
  'Alappuzha': [76.3388, 9.4981],
  'Palakkad': [76.6548, 10.7867],
  'Kannur': [75.3704, 11.8745],
  'Kottayam': [76.5222, 9.5916],
  'Malappuram': [76.0711, 11.0510],

  // Madhya Pradesh
  'Bhopal': [77.4126, 23.2599],
  'Indore': [75.8577, 22.7196],
  'Jabalpur': [79.9864, 23.1815],
  'Gwalior': [78.1828, 26.2183],
  'Ujjain': [75.7849, 23.1765],
  'Sagar': [78.7378, 23.8388],
  'Rewa': [81.3009, 24.5362],
  'Satna': [80.8322, 24.5804],
  'Dewas': [76.0534, 22.9676],
  'Chhindwara': [78.9382, 22.0574],

  // Maharashtra
  'Mumbai': [72.8777, 19.0760],
  'Pune': [73.8567, 18.5204],
  'Nagpur': [79.0882, 21.1458],
  'Nashik': [73.7898, 19.9975],
  'Thane': [72.9781, 19.2183],
  'Chhatrapati Sambhajinagar': [75.3433, 19.8762],
  'Kolhapur': [74.2433, 16.7050],
  'Solapur': [75.9064, 17.6599],
  'Amravati': [77.7523, 20.9320],
  'Nanded': [77.3150, 19.1383],

  // Manipur
  'Imphal West': [93.9368, 24.8170],
  'Imphal East': [93.9803, 24.8325],
  'Thoubal': [94.0044, 24.6360],
  'Bishnupur': [93.7634, 24.6324],
  'Churachandpur': [93.6806, 24.3333],
  'Ukhrul': [94.3644, 25.1118],
  'Senapati': [94.0167, 25.2667],
  'Kakching': [93.9833, 24.4833],
  'Chandel': [94.0167, 24.3167],
  'Tamenglong': [93.4981, 24.9866],

  // Meghalaya
  'East Khasi Hills': [91.8933, 25.5788],
  'West Garo Hills': [90.2200, 25.5144],
  'Ri-Bhoi': [91.8814, 25.9042],
  'East Jaintia Hills': [92.3667, 25.3167],
  'West Jaintia Hills': [92.2000, 25.4500],
  'South Garo Hills': [90.6333, 25.3000],
  'West Khasi Hills': [91.2588, 25.5167],
  'Eastern West Khasi Hills': [91.5000, 25.5500],
  'North Garo Hills': [90.5833, 25.9167],
  'South West Khasi Hills': [91.2667, 25.3167],

  // Mizoram
  'Aizawl': [92.7176, 23.7271],
  'Lunglei': [92.7356, 22.8872],
  'Champhai': [93.3278, 23.4750],
  'Kolasib': [92.6789, 24.2253],
  'Serchhip': [92.8500, 23.3100],
  'Mamit': [92.4883, 23.9297],
  'Lawngtlai': [92.8986, 22.5283],
  'Saitual': [92.9667, 23.9667],
  'Khawzawl': [93.1833, 23.5333],
  'Hnahthial': [92.9333, 22.9667],

  // Nagaland
  'Kohima': [94.1086, 25.6751],
  'Dimapur': [93.7266, 25.9095],
  'Mokokchung': [94.5244, 26.3242],
  'Tuensang': [94.8315, 26.2789],
  'Wokha': [94.2634, 26.0984],
  'Mon': [95.0600, 26.7483],
  'Phek': [94.4667, 25.6667],
  'Zunheboto': [94.5167, 25.9667],
  'Peren': [93.7333, 25.5167],
  'Longleng': [94.8000, 26.4667],

  // Odisha
  'Bhubaneswar': [85.8245, 20.2961],
  'Cuttack': [85.8830, 20.4625],
  'Puri': [85.8312, 19.8135],
  'Sambalpur': [83.9756, 21.4669],
  'Rourkela': [84.8536, 22.2604],
  'Balasore': [86.9324, 21.4934],
  'Ganjam': [85.0606, 19.3813],
  'Koraput': [82.7108, 18.8135],
  'Kendrapara': [86.4230, 20.5015],
  'Mayurbhanj': [86.7326, 21.9287],

  // Punjab
  'Ludhiana': [75.8573, 30.9010],
  'Amritsar': [74.8723, 31.6340],
  'Jalandhar': [75.5762, 31.3260],
  'Patiala': [76.3869, 30.3398],
  'Bathinda': [74.9455, 30.2110],
  'Mohali': [76.7179, 30.7046],
  'Hoshiarpur': [75.9115, 31.5273],
  'Pathankot': [75.6529, 32.2686],
  'Moga': [75.1717, 30.8165],
  'Sangrur': [75.8453, 30.2458],

  // Rajasthan
  'Jaipur': [75.7873, 26.9124],
  'Jodhpur': [73.0243, 26.2389],
  'Udaipur': [73.7125, 24.5854],
  'Kota': [75.8648, 25.2138],
  'Ajmer': [74.6399, 26.4499],
  'Bikaner': [73.3119, 28.0229],
  'Alwar': [76.6029, 27.5530],
  'Bharatpur': [77.4988, 27.2152],
  'Sikar': [75.1398, 27.6094],
  'Jaisalmer': [70.9083, 26.9157],

  // Sikkim
  'Gangtok': [88.6138, 27.3314],
  'Namchi': [88.3569, 27.1664],
  'Gyalshing': [88.2431, 27.2889],
  'Mangan': [88.5284, 27.5054],
  'Pakyong': [88.5833, 27.2333],
  'Soreng': [88.2000, 27.1667],
  'Rangpo': [88.5300, 27.1700],
  'Ravangla': [88.3639, 27.3069],
  'Jorethang': [88.2917, 27.1167],
  'Singtam': [88.4983, 27.2372],

  // Tamil Nadu
  'Chennai': [80.2707, 13.0827],
  'Coimbatore': [76.9558, 11.0168],
  'Madurai': [78.1198, 9.9252],
  'Tiruchirappalli': [78.7047, 10.7905],
  'Salem': [78.1460, 11.6643],
  'Tirunelveli': [77.7567, 8.7139],
  'Erode': [77.7172, 11.3410],
  'Vellore': [79.1325, 12.9165],
  'Thanjavur': [79.1378, 10.7870],
  'Thoothukudi': [78.1348, 8.7642],

  // Telangana
  'Hyderabad': [78.4867, 17.3850],
  'Warangal': [79.5941, 17.9689],
  'Karimnagar': [79.1288, 18.4386],
  'Nizamabad': [78.0941, 18.6725],
  'Khammam': [80.1514, 17.2473],
  'Mahbubnagar': [77.9944, 16.7488],
  'Nalgonda': [79.2684, 17.0575],
  'Adilabad': [78.5320, 19.6641],
  'Suryapet': [79.6236, 17.1439],
  'Siddipet': [78.8520, 18.1018],

  // Tripura
  'Agartala': [91.2868, 23.8315],
  'Udaipur': [91.4984, 23.5351],
  'Dharmanagar': [92.1672, 24.3752],
  'Kailashahar': [92.0089, 24.3283],
  'Belonia': [91.4556, 23.2503],
  'Ambassa': [91.8544, 23.9214],
  'Khowai': [91.6033, 24.0628],
  'Sonamura': [91.2725, 23.4739],
  'Bishalgarh': [91.2678, 23.6822],
  'Sabroom': [91.7000, 23.0000],

  // Uttar Pradesh
  'Lucknow': [80.9462, 26.8467],
  'Kanpur': [80.3319, 26.4499],
  'Varanasi': [82.9739, 25.3176],
  'Prayagraj': [81.8463, 25.4358],
  'Agra': [78.0081, 27.1767],
  'Ghaziabad': [77.4538, 28.6692],
  'Noida': [77.3910, 28.5355],
  'Gorakhpur': [83.3732, 26.7606],
  'Meerut': [77.7064, 28.9845],
  'Bareilly': [79.4304, 28.3670],

  // Uttarakhand
  'Dehradun': [78.0322, 30.3165],
  'Haridwar': [78.1642, 29.9457],
  'Nainital': [79.4636, 29.3919],
  'Haldwani': [79.5286, 29.2183],
  'Rishikesh': [78.2676, 30.0869],
  'Roorkee': [77.8880, 29.8543],
  'Almora': [79.6603, 29.5971],
  'Pauri': [78.7806, 30.1506],
  'Tehri': [78.4800, 30.3800],
  'Udham Singh Nagar': [79.4000, 28.9800],

  // West Bengal
  'Kolkata': [88.3639, 22.5726],
  'Howrah': [88.3103, 22.5958],
  'Darjeeling': [88.2627, 27.0410],
  'Siliguri': [88.4312, 26.7271],
  'Asansol': [86.9746, 23.6739],
  'Durgapur': [87.3119, 23.5204],
  'Malda': [88.1408, 25.0006],
  'Murshidabad': [88.2687, 24.1759],
  'Midnapore': [87.3216, 22.4257],
  'Hooghly': [88.3968, 22.9038],

  // Andaman and Nicobar Islands
  'Sri Vijaya Puram (Port Blair)': [92.7265, 11.6234],
  'Car Nicobar': [92.7816, 9.1714],
  'Diglipur': [93.0000, 13.2667],
  'Mayabunder': [92.9333, 12.9333],
  'Rangat': [92.9333, 12.5000],
  'Havelock Island': [93.0033, 11.9761],
  'Neil Island': [93.0500, 11.8333],
  'Little Andaman': [92.5167, 10.7333],
  'Campbell Bay': [93.9333, 7.0000],
  'Baratang': [92.7500, 12.1167],

  // Dadra and Nagar Haveli and Daman and Diu
  'Silvassa': [73.0083, 20.2763],
  'Daman': [72.8397, 20.3974],
  'Diu': [70.9874, 20.7144],
  'Naroli': [72.9833, 20.3167],
  'Khanvel': [73.0667, 20.1333],
  'Amli': [73.0167, 20.2833],
  'Vapi fringe': [72.9167, 20.3720],
  'Dadra': [72.9667, 20.3167],
  'Samarvarni': [73.0000, 20.2667],
  'Kachigam': [72.8667, 20.4000],

  // Delhi
  'Central Delhi': [77.2167, 28.6448],
  'North Delhi': [77.2000, 28.7000],
  'South Delhi': [77.2167, 28.5355],
  'East Delhi': [77.2800, 28.6300],
  'West Delhi': [77.1000, 28.6500],
  'New Delhi': [77.2090, 28.6139],
  'North West Delhi': [77.1200, 28.7200],
  'North East Delhi': [77.2600, 28.7000],
  'South East Delhi': [77.2700, 28.5400],
  'South West Delhi': [77.0600, 28.5800],

  // Jammu and Kashmir
  'Srinagar': [74.7973, 34.0837],
  'Jammu': [74.8570, 32.7266],
  'Anantnag': [75.1500, 33.7333],
  'Baramulla': [74.3639, 34.2000],
  'Udhampur': [75.0000, 32.9300],
  'Kathua': [75.5200, 32.3700],
  'Pulwama': [74.8900, 33.8700],
  'Rajouri': [74.3000, 33.3700],
  'Kupwara': [74.2500, 34.5300],
  'Doda': [75.5400, 33.1400],

  // Ladakh
  'Leh': [77.5771, 34.1526],
  'Kargil': [76.1325, 34.5539],
  'Nubra': [77.5667, 34.6833],
  'Zanskar': [76.9833, 33.4833],
  'Drass': [75.7500, 34.4300],
  'Shargole': [76.2500, 34.5000],
  'Sankoo': [75.9500, 34.2800],
  'Nyoma': [78.6500, 33.2000],
  'Diskit': [77.5500, 34.5667],
  'Turtuk': [76.8333, 34.8500],

  // Lakshadweep
  'Kavaratti': [72.6420, 10.5669],
  'Agatti': [72.1857, 10.8534],
  'Amini': [72.7300, 11.1200],
  'Andrott': [73.6800, 10.8200],
  'Kadmat': [72.7800, 11.2300],
  'Kalpeni': [73.6500, 10.0800],
  'Kiltan': [73.0000, 11.4800],
  'Minicoy': [73.0500, 8.2800],
  'Chetlat': [72.7000, 11.6800],
  'Bitra': [72.1800, 11.6000],

  // Puducherry
  'Puducherry': [79.8083, 11.9416],
  'Karaikal': [79.8380, 10.9254],
  'Mahe': [75.5343, 11.7002],
  'Yanam': [82.2175, 16.7333],
  'Villianur': [79.7600, 11.9200],
  'Ozhukarai': [79.7800, 11.9600],
  'Bahour': [79.7400, 11.8000],
  'Ariyankuppam': [79.8000, 11.8900],
  'Mannadipet': [79.6800, 11.9900],
  'Nettapakkam': [79.6600, 11.8700],
};

// Fallback state centers in case a district coordinate is not found
const STATE_CENTERS = {
  'Andhra Pradesh': [79.7400, 15.9129],
  'Arunachal Pradesh': [94.7278, 28.2180],
  'Assam': [92.9376, 26.2006],
  'Bihar': [85.3131, 25.0961],
  'Chhattisgarh': [81.8661, 21.2787],
  'Goa': [74.1240, 15.2993],
  'Gujarat': [71.1924, 22.2587],
  'Haryana': [76.0856, 29.0588],
  'Himachal Pradesh': [77.1734, 31.1048],
  'Jharkhand': [85.2799, 23.6102],
  'Karnataka': [75.7139, 15.3173],
  'Kerala': [76.2711, 10.8505],
  'Madhya Pradesh': [78.6569, 22.9734],
  'Maharashtra': [75.7139, 19.7515],
  'Manipur': [93.9063, 24.6637],
  'Meghalaya': [91.3662, 25.4670],
  'Mizoram': [92.9376, 23.1645],
  'Nagaland': [94.5624, 26.1584],
  'Odisha': [85.0985, 20.9517],
  'Punjab': [75.3412, 31.1471],
  'Rajasthan': [74.2179, 27.0238],
  'Sikkim': [88.5122, 27.5330],
  'Tamil Nadu': [78.6569, 11.1271],
  'Telangana': [79.0193, 18.1124],
  'Tripura': [91.9882, 23.9408],
  'Uttar Pradesh': [80.9462, 26.8467],
  'Uttarakhand': [79.0193, 30.0668],
  'West Bengal': [87.8550, 22.9868],
  'Andaman and Nicobar Islands': [92.7265, 11.6234],
  'Chandigarh': [76.7794, 30.7326],
  'Dadra and Nagar Haveli and Daman and Diu': [72.9667, 20.3167],
  'Delhi': [77.2090, 28.6139],
  'Jammu and Kashmir': [74.7973, 33.7782],
  'Ladakh': [77.5771, 34.1526],
  'Lakshadweep': [72.6420, 10.5669],
  'Puducherry': [79.8083, 11.9416],
};

// Robust CSV parser supporting quotes and commas inside quotes
function parseCSV(content) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentField);
      currentField = '';
      if (currentLine.some((f) => f.trim().length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentLine.length > 0) {
    currentLine.push(currentField);
    if (currentLine.some((f) => f.trim().length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

// Map causes to standard category names
function normalizeCategory(cat) {
  if (!cat) return 'Community Development';
  const c = cat.trim();
  const map = {
    'Education': 'Education & Literacy',
    'Healthcare': 'Health & Healthcare',
    'Women Empowerment': 'Women Empowerment',
    'Child Welfare': 'Child Protection & Welfare',
    'Environment': 'Environment & Climate',
    'Rural Development': 'Rural & Village Development',
    'Food Security': 'Hunger Relief & Food Security',
    'Disability Inclusion': 'Disability Support & Inclusion',
    'Elderly Care': 'Elderly & Senior Care',
    'Animal Welfare': 'Animal Welfare',
  };
  return map[c] || c;
}

// Generate realistic state code
const STATE_CODES = {
  'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS', 'Bihar': 'BR',
  'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ', 'Haryana': 'HR',
  'Himachal Pradesh': 'HP', 'Jharkhand': 'JH', 'Karnataka': 'KA', 'Kerala': 'KL',
  'Madhya Pradesh': 'MP', 'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
  'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OD', 'Punjab': 'PB',
  'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN', 'Telangana': 'TS',
  'Tripura': 'TR', 'Uttar Pradesh': 'UP', 'Uttarakhand': 'UK', 'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN', 'Chandigarh': 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD', 'Delhi': 'DL',
  'Jammu and Kashmir': 'JK', 'Ladakh': 'LA', 'Lakshadweep': 'LD', 'Puducherry': 'PY',
};

async function importAllIndiaNgos() {
  try {
    await connectDB();
    console.log('[Import] Connected to MongoDB');

    // 1. Ensure a shared India Coordinator user exists
    let coordinatorUser = await User.findOne({ email: 'india-network@servex.org' });
    if (!coordinatorUser) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('ServeX@India2026', salt);
      coordinatorUser = await User.create({
        fullName: 'All-India NGO Network Coordinator',
        email: 'india-network@servex.org',
        phone: '9800112233',
        passwordHash: hash,
        role: 'ngo',
      });
      console.log('[Import] Created India Coordinator User');
    }

    // 2. Read and parse the CSV file
    const csvPath = path.resolve(__dirname, '../data/india_all_states_ngos.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(csvContent);
    const headers = rows[0].map((h) => h.trim());
    console.log(`[Import] Total rows in CSV: ${rows.length - 1}`);

    const stateIdx = headers.indexOf('state_or_UT');
    const districtIdx = headers.indexOf('district_or_area');
    const sampleOrderIdx = headers.indexOf('sample_order_not_ranking');
    const nameIdx = headers.indexOf('ngo_name');
    const catIdx = headers.indexOf('primary_work_category');
    const descIdx = headers.indexOf('sample_activity_description');

    let insertedCount = 0;
    let updatedCount = 0;
    const errors = [];

    // Track sector coordinates in Chandigarh so they don't land on same point
    let chandigarhCounter = 0;
    const chandigarhSpread = [
      [76.7794, 30.7398], // Sec 17
      [76.7680, 30.7350], // Sec 22
      [76.7634, 30.7225], // Sec 35
      [76.7450, 30.7180], // Sec 43
      [76.8120, 30.7320], // Sec 26
      [76.7950, 30.7500], // Sec 8
      [76.7720, 30.7580], // Sec 11
      [76.8450, 30.7180], // Manimajra
      [76.8050, 30.7090], // Ind Area
      [76.7380, 30.6970], // Sec 49
    ];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const state = row[stateIdx]?.trim();
      const district = row[districtIdx]?.trim();
      const sampleOrder = row[sampleOrderIdx]?.trim() || `${i}`;
      let ngoName = row[nameIdx]?.trim();
      const primaryCat = row[catIdx]?.trim();
      const description = row[descIdx]?.trim() || 'Working actively to empower communities and deliver impactful social support.';

      if (!ngoName || !state) continue;

      // Clean up any stray non-ascii from sample names if needed
      ngoName = ngoName.replace(/公益/g, 'Public Welfare');

      // Determine Coordinates
      let coords = null;
      if (state === 'Chandigarh') {
        coords = chandigarhSpread[chandigarhCounter % chandigarhSpread.length];
        chandigarhCounter++;
      } else if (DISTRICT_COORDINATES[district]) {
        coords = [...DISTRICT_COORDINATES[district]];
        // Apply slight micro-jitter (approx 100-300m) to keep points natural
        const jitterLng = (Math.sin(i * 13) * 0.004);
        const jitterLat = (Math.cos(i * 17) * 0.004);
        coords = [+(coords[0] + jitterLng).toFixed(5), +(coords[1] + jitterLat).toFixed(5)];
      } else if (STATE_CENTERS[state]) {
        const base = STATE_CENTERS[state];
        const offsetLng = (Math.sin(i) * 0.08);
        const offsetLat = (Math.cos(i) * 0.08);
        coords = [+(base[0] + offsetLng).toFixed(5), +(base[1] + offsetLat).toFixed(5)];
      } else {
        coords = [77.2090, 28.6139]; // Default Delhi
      }

      const stCode = STATE_CODES[state] || 'IN';
      const regNumber = `IND/${stCode}/2024/${String(sampleOrder).padStart(4, '0')}`;
      const normalizedCat = normalizeCategory(primaryCat);

      // Contact person generator
      const contactPersons = [
        'Dr. Rajeshwar Sharma', 'Sunita Rao', 'Col. Amarjit Singh', 'Ananya Roy',
        'Venkatesh Iyer', 'Pooja Bhattacharya', 'Mohammad Tariq', 'Lakshmi Narayan',
        'Kavita Nair', 'Pradeep Kulkarni', 'Geeta Sen', 'Tashi Namgyal'
      ];
      const contactPerson = contactPersons[(i * 3) % contactPersons.length];

      const docData = {
        userId: coordinatorUser._id,
        organizationName: ngoName,
        registrationNumber: regNumber,
        contactPerson: contactPerson,
        description: description,
        logo: '',
        address: `${district} Center, Main Road`,
        city: district,
        state: state,
        pincode: `${(100000 + ((i * 1423) % 899999))}`,
        locationCoordinates: {
          type: 'Point',
          coordinates: coords, // [longitude, latitude]
        },
        causeCategories: [normalizedCat, primaryCat].filter(Boolean),
        verificationStatus: 'verified',
        rejectionReason: '',
      };

      const result = await NGO.findOneAndUpdate(
        { organizationName: ngoName, state: state },
        { $set: docData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (result) {
        insertedCount++;
      }
    }

    const totalInDb = await NGO.countDocuments({ verificationStatus: 'verified' });
    const distinctStates = await NGO.distinct('state', { verificationStatus: 'verified' });
    const distinctCities = await NGO.distinct('city', { verificationStatus: 'verified' });

    console.log(`[Import] Finished processing! Processed: ${insertedCount}`);
    console.log(`[Import] Total verified NGOs in DB: ${totalInDb}`);
    console.log(`[Import] Distinct states in DB: ${distinctStates.length}`);
    console.log(`[Import] Distinct cities in DB: ${distinctCities.length}`);

    process.exit(0);
  } catch (err) {
    console.error('[Import] Error:', err);
    process.exit(1);
  }
}

importAllIndiaNgos();

