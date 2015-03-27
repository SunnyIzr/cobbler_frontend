<?php
$total = 0;

$prices = array(
    'menShoes'   => array(135, 115),
    'womenShoes' => array(85, 75),
    'handbags'   => array(235, 205),
);

foreach($prices as $item => $price) {
    $quantity = $_POST["{$item}Quantity"];

    if ($quantity > 1) {
        $total += $price[0];
        --$quantity;
    }

    $total += $price[1] * $quantity;
}

echo $total;