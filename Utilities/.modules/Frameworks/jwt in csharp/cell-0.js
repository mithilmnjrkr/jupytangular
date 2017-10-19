#r
'System.Net'

// The above should get System.Net from GAC
using
System.Net;
string
GetUrlContent(string
uri
)
{

    WebClient
    client = new WebClient();

    using(Stream
    data = client.OpenRead(uri)
)
    {
        using(StreamReader
        reader = new StreamReader(data)
    )
        {
            string
            s = reader.ReadToEnd();
            return s;
        }
    }

}

GetUrlContent('http://zohaib.me');
