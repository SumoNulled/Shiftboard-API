# Shiftboard-API
Simple API/Webscraper to retrieve worked hours from shiftboard. This API can be used to update internal timesheets.

## PHP Example
```
class API {
...
...
public function response()
    {
      $ch = curl_init();
      $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';
      curl_setopt($ch, CURLOPT_USERAGENT, $config['useragent']);
      curl_setopt($ch, CURLOPT_REFERER, '[URL HERE]');
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_URL, $this->get_ApiURL());
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
      curl_setopt($ch, CURLOPT_VERBOSE, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      $response = curl_exec($ch);
      curl_close($ch);
      $data = json_decode($response);

      return $data;
    }
}

$api = new API($url);
$shiftboard = $api->response();

echo $shiftboard->error ?? "";

print_r($shiftboard); // View the JSON response.
echo $shiftboard->account_information->display_name; // Retrieve the user's display name from shiftboard.
echo $shiftboard->account_information->id; // Retrieve the user's ID from shiftboard.

print_r($shiftboard->day); // View the days and hours worked.
```
