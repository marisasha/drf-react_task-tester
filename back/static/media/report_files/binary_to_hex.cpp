// перевод из двоичной в шестеричную систему 
#include <iostream>
#include <cmath>  

int findLen(char array[]) {
    int count = 0;
    for (int i = 0; array[i] != '\0'; ++i) {
        count++;
    }
    return count;
}

void binaryToHexadecimal(char binary[], char hexadecimal[]) {
    int lenbinary = findLen(binary);

    while (lenbinary % 4 != 0) {
        for (int i = lenbinary; i >= 0; --i) {
            binary[i + 1] = binary[i];
        }
        binary[0] = '0';
        lenbinary = findLen(binary);
    }
    binary[lenbinary] = '\0';

    int hexadecimalIndex = 0;

    for (int i = 0; i <= lenbinary; i++) {
        if (i % 4 == 0 && i != 0) {
            int group_sum = (binary[i - 4] - '0') * 8 +
                            (binary[i - 3] - '0') * 4 +
                            (binary[i - 2] - '0') * 2 +
                            (binary[i - 1] - '0') * 1;
            if (group_sum < 10) {
                hexadecimal[hexadecimalIndex++] = group_sum + '0';
            } else {
                hexadecimal[hexadecimalIndex++] = group_sum - 10 + 'A';
            }
        }
    }
    hexadecimal[hexadecimalIndex] = '\0';  
}

void binaryFractionToHexadecimal(char binaryFraction[], char hexadecimal[]) {
    int lenbinary = findLen(binaryFraction);
    int fractionalIndex = 0;

    while (lenbinary % 4 != 0) {  
        binaryFraction[lenbinary++] = '0';
    }
    binaryFraction[lenbinary] = '\0';

    for (int i = 0; i < lenbinary; i += 4) {
        int group_sum = (binaryFraction[i] - '0') * 8 +
                        (binaryFraction[i + 1] - '0') * 4 +
                        (binaryFraction[i + 2] - '0') * 2 +
                        (binaryFraction[i + 3] - '0') * 1;
        if (group_sum < 10) {
            hexadecimal[fractionalIndex++] = group_sum + '0';
        } else {
            hexadecimal[fractionalIndex++] = group_sum - 10 + 'A';
        }
    }
    hexadecimal[fractionalIndex] = '\0'; 
}

bool isCorrectBinary(char binary[]) {
    int lenbinary = findLen(binary);
    for (int i = 0; i < lenbinary; ++i) {
        if (binary[i] != '0' && binary[i] != '1' && binary[i] != '.') { 
            return false;
        }
    }
    return true;
}

int main() {
    setlocale(LC_ALL, "ru_RU.UTF-8");
    char binary[100], hexadecimal[50];
    
    std::cout << "Введите двоичное число (целое или дробное): ";
    std::cin >> binary;

    if (!isCorrectBinary(binary)) {
        std::cout << "Ошибка: Вы ввели некорректное двоичное число!" << std::endl;
        return 1;
    }


    char* pointPosition = strchr(binary, '.');
    char binaryWhole[50] = {0}, binaryFraction[50] = {0};

    if (pointPosition != nullptr) {
        strncpy(binaryWhole, binary, pointPosition - binary);  
        strcpy(binaryFraction, pointPosition + 1);       
    } else {
        strcpy(binaryWhole, binary);  
    }

    char hexWhole[50] = {0}, hexFraction[50] = {0};


    binaryToHexadecimal(binaryWhole, hexWhole);


    if (binaryFraction[0] != '\0') {
        binaryFractionToHexadecimal(binaryFraction, hexFraction);
    }

    std::cout << "Шестнадцатеричное представление числа: " << hexWhole;
    if (hexFraction[0] != '\0') {
        std::cout << "." << hexFraction;
    }
    std::cout << std::endl;

    return 0;
}