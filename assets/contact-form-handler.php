<?php
$errors = '';
$myemail = 'marek@okostudio.com';

if(empty($_POST['your_name'])  ||
   empty($_POST['your_email']) ||
   empty($_POST['your_subject']) ||
   empty($_POST['your_message']))
{
    $errors .= "\n Error: all fields are required";
}
$name = $_POST['your_name'];
$email_address = $_POST['your_email'];
$subject = $_POST['your_subject'];
$message = $_POST['your_message'];
if (!preg_match(
"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i",
$email_address))
{
    $errors .= "\n Error: Invalid email address";
}

if( empty($errors))
{
$to = $myemail;
$email_subject = "Contact form submission: $subject";
$email_body = "You have received a new message. ".
" Here are the details:\n Name: $name \n ".
"Email: $email_address\n Message \n $message";

    $headers = "From: ". $myemail . "\r\n" ;
    $headers .= "Reply-To: ". $email_address . "\r\n" ;
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n"; 

mail($to,$email_subject,$email_body,$headers);
//redirect to the 'thank you' page
header('Location: /2017/#thanks');
}
?>