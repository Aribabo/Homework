import requests
from bs4 import BeautifulSoup
import pandas as pd

def music(num):
    rank = []
    for i in range (num):
        url = f'https://www.genie.co.kr/chart/top200?ditc=D&ymd=20231122&hh=14&rtm=Y&pg={i+1}'
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        request = requests.get(url, headers = header)
        soup = BeautifulSoup(request.text)
        td = soup.findAll('td',{'class':'info'})
        for j in td:
            title = j.find('a',{'class':'title'})
            artist = j.find('a',{'class':'artist'})
            rank.append([artist.text.strip(), title.text.strip()])
    return rank

df = pd.DataFrame(music(4), index = range(len(music(4))))
df.to_excel('genie_chart.xlsx')